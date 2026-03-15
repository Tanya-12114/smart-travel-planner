"use client"
import { useState } from "react"

export default function CreateTripModal({ onCreate }) {
  const [open, setOpen] = useState(false)
  const [trip, setTrip] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: ""
  })

  const handleSubmit = () => {
    if (!trip.name.trim()) return
    onCreate(trip)
    setTrip({ name: "", destination: "", startDate: "", endDate: "" })
    setOpen(false)
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="btn-rust"
      >
        + New Trip
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-paper border border-sand rounded-2xl p-8 w-[420px] shadow-2xl">
            <p className="eyebrow mb-1">New Journey</p>
            <h2 className="font-display text-2xl font-semibold text-ink mb-6">Plan a Trip</h2>

            <div className="flex flex-col gap-3">
              <input
                placeholder="Trip name"
                value={trip.name}
                className="input-base"
                onChange={(e) => setTrip({ ...trip, name: e.target.value })}
              />
              <input
                placeholder="Destination"
                value={trip.destination}
                className="input-base"
                onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-1 block">
                    Start date
                  </label>
                  <input
                    type="date"
                    className="input-base w-full"
                    onChange={(e) => setTrip({ ...trip, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-1 block">
                    End date
                  </label>
                  <input
                    type="date"
                    className="input-base w-full"
                    onChange={(e) => setTrip({ ...trip, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn-rust flex-1"
              >
                Create Trip →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}