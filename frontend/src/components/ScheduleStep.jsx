
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  getAvailability,
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

  const dateIsValid =
    Boolean(date) &&
    date >= minDate &&
    date <= maxDate;

  const canLoadSlots = Boolean(dentist) && dateIsValid;

  const slotsState = useFetch(
    () =>
      canLoadSlots
        ? getAvailability(dentist.id, date)
        : Promise.resolve(null),
    [dentist?.id, date, canLoadSlots]
  );

  const slots = slotsState.data ?? [];

  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");

  const pickDentist = (selectedDentist) => {
    setCheckError("");
    onDentistChange(selectedDentist);
  };

  const pickDate = (value) => {
    setCheckError("");
    onDateChange(value);
  };

  const pickSlot = (slot) => {
    setCheckError("");
    onTimeChange(slot);
  };

  // Re-check availability before allowing the patient to continue.
  const handleContinue = async () => {
    if (!dentist || !dateIsValid || !timeSlot || checking) {
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
          "Sorry, that time was just taken. Please choose another slot."
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
                    <DentistAvatar
                      photo={d.photo}
                      name={d.name}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-brand-dark">
                        {d.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {d.specialization}
                      </p>
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

      {/* Date selection */}
      <section>
        <h2 className="mb-6 text-center text-2xl font-semibold text-brand-dark">
          Pick a date
        </h2>

        <div className="mx-auto max-w-sm rounded-2xl border border-accent/15 bg-white p-5 shadow-sm">
          <label
            htmlFor="appointment-date"
            className="mb-2 block font-medium text-brand-dark"
          >
            Appointment date
          </label>

          <input
            id="appointment-date"
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            onChange={(event) => pickDate(event.target.value)}
            className="w-full rounded-lg border border-accent/25 bg-white px-4 py-3 text-brand-dark focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />

          {date && !dateIsValid && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              Please choose a date from today up to{" "}
              {formatDisplayDate(maxDate)}.
            </p>
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
            Pick a date to see {dentist.name}'s available times.
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
              )}. Please try another date or choose a different dentist.`}
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
          {timeSlot ? (
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
            "Select a dentist, date, and time to continue."
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
            disabled={!timeSlot || checking}
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
