import TimeTracker from "../TimeTracker";

export default function TimeTrackerExample() {
  return (
    <div className="p-4">
      <TimeTracker
        initialTime={0}
        onStart={() => console.log("Timer started")}
        onPause={() => console.log("Timer paused")}
        onFinish={() => console.log("Timer finished")}
        onTimeUpdate={(time) => console.log("Time:", time)}
      />
    </div>
  );
}
