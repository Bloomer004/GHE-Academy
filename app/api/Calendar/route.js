import { connectDB } from "@/lib/db";
import CalendarModel from "@/models/Calendar";
import { NextResponse } from "next/server";

// ✅ GET all calendar events
export async function GET() {
  try {
    await connectDB();
    const events = await CalendarModel.find();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
  }
}

// ✅ POST - Add a new calendar event
export async function POST(req) {
  try {
    await connectDB();
    const { month, date, event } = await req.json();

    if (!month || !date || !event) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newEvent = await CalendarModel.create({ month, date, event });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding event" }, { status: 500 });
  }
}

// ✅ PUT - Update an existing calendar event
export async function PUT(req) {
  try {
    await connectDB();
    const { id, month, date, event } = await req.json();

    if (!id || !month || !date || !event) {
      return NextResponse.json({ error: "ID and all fields are required" }, { status: 400 });
    }

    const updatedEvent = await CalendarModel.findByIdAndUpdate(id, { month, date, event }, { new: true });

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: "Error updating event" }, { status: 500 });
  }
}

// ✅ DELETE - Remove a calendar event
export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const deletedEvent = await CalendarModel.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
  }
}
