import { useState } from "react";
import {
  getAvailability,
  getDentists,
  getErrorMessage,
} from "../api";
import useFetch from "../hooks/useFetch";

import {
  addDays,
  formatDisplayDate,
  formatTime,
  toInputDate,
} from "../utils/dates";

import DentistAvatar from "./DentistAvatar";
import EmptyState from "./EmptyState";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

const BOOKING_WINDOW_DAYS = 60;

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
  // Load all dentists
  const dentistsState = useFetch(getDentists);
  const dentists = dentistsState.data ?? [];

  // Date limits
  const today = new Date();

  const minDate = toInputDate(today);

  const maxDate = toInputDate(
    addDays(today, BOOKING_WINDOW_DAYS)
  );

  const dateIsValid =
    Boolean(date) &&
    date >= minDate &&
    date <= maxDate;

  // Only load availability when dentist + valid date exist
  const canLoadSlots =
    Boolean(dentist) && dateIsValid;

  const slotsState = useFetch(
    () =>
      canLoadSlots
        ? getAvailability(dentist.id, date)
        : Promise.resolve(null),
    [dentist?.id, date, canLoadSlots]
  );

  const slots = slotsState.data ?? [];

  // Used while checking the selected slot
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");

  // Dentist selection
  const pickDentist = (d) => {
    setCheckError("");
    onDentistChange(d);
  };

  // Date selection
  const pickDate = (value) => {
    setCheckError("");
    onDateChange(value);
  };

  // Time selection
  const pickSlot = (slot) => {
    setCheckError("");
    onTimeChange(slot);
  };

  // Re-check selected slot with backend
  const handleContinue = async () => {
    setChecking(true);
    setCheckError("");

    try {
      const freshSlots = await getAvailability(
        dentist.id,
        date
      );

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

      {/* ==================== Dentist ==================== */}

      <div>
        <h2 className="mb-6 text-center text-2xl font-semibold text-brand-dark">
          Choose your dentist
        </h2>

        {dentistsState.loading && (
          <Loading message="Loading our dentists..." />
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
              {dentists.map((d) => {
                const isSelected = dentist?.id === d.id;

                return (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => pickDentist(d)}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-4 rounded-xl bg-white p-4 text-left shadow-md transition ${
                      isSelected
                        ? "ring-2 ring-brand"
                        : "hover:-translate-y-1 hover:shadow-lg"
                    }`}
                  >
                    <DentistAvatar
                      photo={d.photo}
                      name={d.name}
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-brand-dark">
                        {d.name}
                      </p>

                      <p className="text-sm text-gray-600">
                        {d.specialization}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-sm text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
      </div>

      {/* ==================== Date ==================== */}

      <div>
        <h2 className="mb-6 text-center text-2xl font-semibold text-brand-dark">
          Pick a date
        </h2>

        <div className="mx-auto max-w-sm rounded-xl bg-white p-5 shadow-md">

          <label
            htmlFor="appointment-date"
            className="mb-2 block font-medium text-gray-700"
          >
            Appointment date
          </label>

          <input
            id="appointment-date"
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            onChange={(e) =>
              pickDate(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />

          {date && !dateIsValid && (
            <p className="mt-2 text-sm text-red-600">
              Please choose a date from today up to{" "}
              {formatDisplayDate(maxDate)}.
            </p>
          )}

        </div>
      </div>

      {/* ==================== Time Slots ==================== */}

      <div>
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
          <Loading message="Checking available times..." />
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
                {formatDisplayDate(date)} with{" "}
                {dentist.name}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

                {slots.map((slot) => {
                  const isSelected =
                    slot === timeSlot;

                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => pickSlot(slot)}
                      aria-pressed={isSelected}
                      className={`rounded-lg border px-3 py-3 font-medium transition ${
                        isSelected
                          ? "border-brand bg-brand text-white"
                          : "border-gray-300 bg-white text-brand-dark hover:border-brand"
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  );
                })}

              </div>
            </div>
          )}
      </div>

      {/* ==================== Summary ==================== */}

      <div className="rounded-xl bg-white p-5 shadow-md">

        {checkError && (
          <p
            className="mb-4 rounded-lg bg-red-50 p-3 text-center text-red-700"
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

        {/* Navigation */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-brand px-5 py-3 font-semibold text-brand transition hover:bg-brand-light/30"
          >
            ← Change service
          </button>

          <button
            type="button"
            disabled={!timeSlot || checking}
            onClick={handleContinue}
            className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checking
              ? "Checking availability..."
              : "Continue"}
          </button>

        </div>

      </div>

    </div>
  );
}