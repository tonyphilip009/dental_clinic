
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  getAvailability,
  getAvailableDates,
  getDentists,
  getErrorMessage,
} from "../api";

import useFetch from "../hooks/useFetch";

import {
  BOOKING_WINDOW_DAYS,
  addDays,
  formatDisplayDate,
  formatTime,
  toInputDate,
} from "../utils/dates";

import DentistAvatar from "./DentistAvatar";
import EmptyState from "./EmptyState";
import ErrorMessage from "./ErrorMessage";
import { CardSkeletonGrid, Skeleton } from "./ui/Skeleton";

const EASE = [0.22, 1, 0.36, 1];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthLabel(date) {
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function sameMonth(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth()
  );
}

export default function ScheduleStep({
  service,
  dentist,
  date,
  timeSlot,
  onDentistChange,
  onDateChange,
  onTimeChange,
  onBack,
  onContinue,
}) {
  const dentistsState = useFetch(getDentists);
  const dentists = dentistsState.data ?? [];
  const reduceMotion = useReducedMotion();

  const today = new Date();
  const minDate = toInputDate(today);
  const maxDate = toInputDate(
    addDays(today, BOOKING_WINDOW_DAYS)
  );

  const [visibleMonth, setVisibleMonth] = useState(
    () => getMonthStart(today)
  );

  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");

  // Fetch dates that have at least one available slot for this dentist.
  const availableDatesState = useFetch(
    () =>
      dentist
        ? getAvailableDates(dentist.id)
        : Promise.resolve([]),
    [dentist?.id]
  );

  const availableDates = availableDatesState.data ?? [];

  // Fetch time slots only after an available date is selected.
  const dateIsValid =
    Boolean(date) &&
    date >= minDate &&
    date <= maxDate &&
    availableDates.includes(date);

  const canLoadSlots =
    Boolean(dentist) &&
    dateIsValid &&
    !availableDatesState.loading &&
    !availableDatesState.error;

  const slotsState = useFetch(
    () =>
      canLoadSlots
        ? getAvailability(dentist.id, date)
        : Promise.resolve(null),
    [dentist?.id, date, canLoadSlots]
  );

  const slots = slotsState.data ?? [];

  // Build the visible month, starting on Monday.
  const firstDayOfMonth = getMonthStart(visibleMonth);
  const mondayOffset = (firstDayOfMonth.getDay() + 6) % 7;

  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0
  ).getDate();

  const calendarCells = [
    ...Array(mondayOffset).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) =>
        new Date(
          visibleMonth.getFullYear(),
          visibleMonth.getMonth(),
          index + 1
        )
    ),
  ];

  const minimumMonth = getMonthStart(today);
  const maximumMonth = getMonthStart(addDays(today, BOOKING_WINDOW_DAYS));

  const canGoPrevious =
    visibleMonth.getTime() > minimumMonth.getTime();

  const canGoNext =
    visibleMonth.getTime() < maximumMonth.getTime();

  const pickDentist = (selectedDentist) => {
    setCheckError("");

    // A date selected for another dentist may not be available.
    onDateChange("");
    onTimeChange("");
    onDentistChange(selectedDentist);

    setVisibleMonth(getMonthStart(today));
  };

  const pickDate = (value) => {
    if (!availableDates.includes(value)) return;

    setCheckError("");
    onDateChange(value);
    onTimeChange("");
  };

  const pickSlot = (slot) => {
    setCheckError("");
    onTimeChange(slot);
  };

  const handleContinue = async () => {
    if (
      !dentist ||
      !dateIsValid ||
      !timeSlot ||
      checking
    ) {
      return;
    }

    setChecking(true);
    setCheckError("");

    try {
      const freshSlots = await getAvailability(dentist.id, date);

      if (!freshSlots.includes(timeSlot)) {
        onTimeChange("");
        slotsState.reload();

        setCheckError(
          "Sorry, that time is no longer available. Please choose another slot."
        );

        return;
      }

      onContinue();
    } catch (err) {
      setCheckError(
        getErrorMessage(
          err,
          "We couldn't confirm that time slot. Please try again."
        )
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Dentist selection */}
      <section>
        <h2 className="mb-6 text-center text-2xl font-semibold text-brand-dark">
          Choose your dentist
        </h2>

        {dentistsState.loading && (
          <CardSkeletonGrid
            count={3}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          />
        )}

        {dentistsState.error && (
          <ErrorMessage
            message={getErrorMessage(
              dentistsState.error,
              "We couldn't load our dentists right now."
            )}
            onRetry={dentistsState.reload}
          />
        )}

        {!dentistsState.loading &&
          !dentistsState.error &&
          dentists.length === 0 && (
            <EmptyState
              title="No dentists available for booking yet"
              message="Please contact the clinic directly to book your appointment."
            />
          )}

        {!dentistsState.loading &&
          !dentistsState.error &&
          dentists.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dentists.map((d, index) => {
                const isSelected = dentist?.id === d.id;

                return (
                  <motion.button
                    type="button"
                    key={d.id}
                    onClick={() => pickDentist(d)}
                    aria-pressed={isSelected}
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 14 }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isSelected && !reduceMotion ? 1.01 : 1,
                    }}
                    whileHover={
                      reduceMotion ? undefined : { y: -3 }
                    }
                    whileTap={
                      reduceMotion ? undefined : { scale: 0.98 }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.3,
                      delay: reduceMotion ? 0 : (index % 3) * 0.05,
                      ease: EASE,
                    }}
                    className={`flex items-center gap-4 rounded-2xl border bg-white p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      isSelected
                        ? "border-accent ring-2 ring-accent/40 shadow-lg"
                        : "border-accent/15 shadow-sm hover:border-accent/40 hover:shadow-md"
                    }`}
                  >
                    <DentistAvatar photo={d.photo} name={d.name} />

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-brand-dark">
                        {d.name}
                      </p>

                      {d.specialization && (
                        <p className="mt-1 text-sm text-gray-600">
                          {d.specialization}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <span
                        aria-label="Selected"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-brand-dark"
                      >
                        ✓
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
      </section>

      {/* Available-date calendar */}
      <section>
        <h2 className="mb-2 text-center text-2xl font-semibold text-brand-dark">
          Pick a date
        </h2>

        <p className="mb-6 text-center text-sm text-gray-500">
          Choose a date when your selected dentist is available.
        </p>

        <div className="mx-auto max-w-lg rounded-2xl border border-accent/20 bg-white p-4 shadow-sm sm:p-6">
          {!dentist && (
            <p className="py-8 text-center text-sm text-gray-500">
              Select a dentist first to see available dates.
            </p>
          )}

          {dentist && availableDatesState.loading && (
            <div className="space-y-5 py-4">
              <Skeleton className="h-8 w-full rounded-lg" />
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, index) => (
                  <Skeleton
                    key={index}
                    className="h-10 rounded-lg"
                  />
                ))}
              </div>
              <p className="text-center text-sm text-gray-500">
                Checking available dates...
              </p>
            </div>
          )}

          {dentist && availableDatesState.error && (
            <ErrorMessage
              message={getErrorMessage(
                availableDatesState.error,
                "We couldn't load available dates."
              )}
              onRetry={availableDatesState.reload}
            />
          )}

          {dentist &&
            !availableDatesState.loading &&
            !availableDatesState.error &&
            availableDates.length === 0 && (
              <EmptyState
                icon="📅"
                title="No available dates"
                message={`${dentist.name} has no available appointments in the current booking window. Please contact the clinic or choose another dentist.`}
              />
            )}

          {dentist &&
            !availableDatesState.loading &&
            !availableDatesState.error &&
            availableDates.length > 0 && (
              <>
                {/* Calendar month navigation */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={!canGoPrevious}
                    onClick={() =>
                      setVisibleMonth(
                        new Date(
                          visibleMonth.getFullYear(),
                          visibleMonth.getMonth() - 1,
                          1
                        )
                      )
                    }
                    aria-label="Previous month"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/20 text-lg text-brand-dark transition hover:bg-brand-light/30 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ←
                  </button>

                  <h3
                    aria-live="polite"
                    className="text-lg font-semibold text-brand-dark"
                  >
                    {getMonthLabel(visibleMonth)}
                  </h3>

                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() =>
                      setVisibleMonth(
                        new Date(
                          visibleMonth.getFullYear(),
                          visibleMonth.getMonth() + 1,
                          1
                        )
                      )
                    }
                    aria-label="Next month"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/20 text-lg text-brand-dark transition hover:bg-brand-light/30 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    →
                  </button>
                </div>

                {/* Weekday headings */}
                <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">
                  {WEEKDAYS.map((weekday) => (
                    <div
                      key={weekday}
                      className="py-2 text-center text-xs font-semibold text-gray-500"
                    >
                      {weekday}
                    </div>
                  ))}
                </div>

                {/* Calendar dates */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {calendarCells.map((day, index) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${index}`}
                          aria-hidden="true"
                        />
                      );
                    }

                    const value = toInputDate(day);
                    const isAvailable = availableDates.includes(value);
                    const isSelected = date === value;
                    const isToday = value === minDate;

                    const outsideWindow =
                      value < minDate || value > maxDate;

                    const disabled =
                      !isAvailable || outsideWindow;

                    return (
                      <button
                        type="button"
                        key={value}
                        disabled={disabled}
                        onClick={() => pickDate(value)}
                        aria-pressed={isSelected}
                        aria-label={`${formatDisplayDate(value)}${
                          isAvailable ? ", available" : ", unavailable"
                        }`}
                        title={
                          isAvailable
                            ? "Available for booking"
                            : "No appointment slots available"
                        }
                        className={[
                          "relative flex aspect-square min-h-9 items-center justify-center rounded-lg border text-sm transition-all duration-200",
                          isSelected
                            ? "border-accent bg-accent font-bold text-brand-dark shadow-md ring-2 ring-accent/30"
                            : isAvailable
                              ? "border-accent/20 bg-[#FCFAF6] font-semibold text-brand-dark hover:border-accent hover:bg-brand-light/30"
                              : "cursor-not-allowed border-transparent bg-gray-50 text-gray-300",
                          isToday && !isSelected
                            ? "ring-1 ring-accent/50"
                            : "",
                        ].join(" ")}
                      >
                        {day.getDate()}

                        {isAvailable && !isSelected && (
                          <span
                            className="absolute bottom-1 h-1 w-1 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar legend */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-accent" />
                    Available
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-gray-200" />
                    Unavailable
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border border-accent" />
                    Today
                  </span>
                </div>

                {date && !dateIsValid && (
                  <p className="mt-4 text-center text-sm text-red-600" role="alert">
                    This date is no longer available. Please choose another date.
                  </p>
                )}

                {dateIsValid && (
                  <p className="mt-4 rounded-lg bg-[#FCFAF6] p-3 text-center text-sm text-brand-dark">
                    Selected date:{" "}
                    <span className="font-semibold">
                      {formatDisplayDate(date)}
                    </span>
                  </p>
                )}
              </>
            )}
        </div>
      </section>

      {/* Time-slot selection */}
      <section>
        <h2 className="mb-6 text-center text-2xl font-semibold text-brand-dark">
          Choose a time
        </h2>

        {!dentist && (
          <p className="text-center text-gray-500">
            Choose a dentist and a date to see available times.
          </p>
        )}

        {dentist && !date && (
          <p className="text-center text-gray-500">
            Pick an available date to see {dentist.name}'s times.
          </p>
        )}

        {dentist && date && !dateIsValid &&
          !availableDatesState.loading &&
          !availableDatesState.error && (
            <p className="text-center text-gray-500">
              Please select an available date from the calendar.
            </p>
          )}

        {canLoadSlots && slotsState.loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        )}

        {canLoadSlots && slotsState.error && (
          <ErrorMessage
            message={getErrorMessage(
              slotsState.error,
              "We couldn't load available times right now."
            )}
            onRetry={slotsState.reload}
          />
        )}

        {canLoadSlots &&
          !slotsState.loading &&
          !slotsState.error &&
          slots.length === 0 && (
            <EmptyState
              icon="📅"
              title="No times available on this date"
              message={`${dentist.name} has no open slots on ${formatDisplayDate(
                date
              )}. Please choose another date or dentist.`}
            />
          )}

        {canLoadSlots &&
          !slotsState.loading &&
          !slotsState.error &&
          slots.length > 0 && (
            <div>
              <p className="mb-4 text-center text-gray-600">
                {formatDisplayDate(date)} with {dentist.name}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {slots.map((slot, index) => {
                  const isSelected = slot === timeSlot;

                  return (
                    <motion.button
                      type="button"
                      key={slot}
                      onClick={() => pickSlot(slot)}
                      aria-pressed={isSelected}
                      initial={
                        reduceMotion ? false : { opacity: 0, y: 8 }
                      }
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: isSelected && !reduceMotion ? 1.03 : 1,
                      }}
                      whileHover={
                        reduceMotion ? undefined : { y: -2 }
                      }
                      whileTap={
                        reduceMotion ? undefined : { scale: 0.97 }
                      }
                      transition={{
                        duration: reduceMotion ? 0 : 0.22,
                        delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.2),
                        ease: EASE,
                      }}
                      className={`rounded-lg border px-3 py-3 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        isSelected
                          ? "border-accent bg-accent text-brand-dark shadow-sm"
                          : "border-accent/20 bg-white text-brand-dark hover:border-accent/60"
                      }`}
                    >
                      {formatTime(slot)}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
      </section>

      {/* Booking summary and navigation */}
      <section className="rounded-2xl border border-accent/15 bg-white p-5 shadow-sm">
        {checkError && (
          <p
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-red-700"
            role="alert"
          >
            {checkError}
          </p>
        )}

        <p className="mb-4 text-center text-gray-700 sm:text-left">
          {timeSlot && dateIsValid ? (
            <>
              <span className="font-semibold text-brand-dark">
                {service?.name}
              </span>{" "}
              with{" "}
              <span className="font-semibold text-brand-dark">
                {dentist?.name}
              </span>{" "}
              on {formatDisplayDate(date)} at{" "}
              <span className="font-semibold text-brand-dark">
                {formatTime(timeSlot)}
              </span>
            </>
          ) : (
            "Select a dentist, available date, and time to continue."
          )}
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-accent/40 px-5 py-3 font-semibold text-brand-dark transition hover:bg-brand-light/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            ← Change service
          </button>

          <button
            type="button"
            disabled={
              !timeSlot ||
              !dateIsValid ||
              !slots.includes(timeSlot) ||
              checking
            }
            onClick={handleContinue}
            className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checking ? "Checking availability..." : "Continue →"}
          </button>
        </div>
      </section>
    </div>
  );
}
