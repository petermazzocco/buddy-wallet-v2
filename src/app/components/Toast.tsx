export default function Toast({ children }: { children: React.ReactNode }) {
  return (
    <div className="toast toast-top toast-center">
      <div className="alert alert-info">{children}</div>
    </div>
  );
}
