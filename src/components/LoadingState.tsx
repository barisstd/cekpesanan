export function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-cloth/20 border-t-cloth" />
      <p className="text-sm text-ink/60">{message}</p>
    </div>
  );
}
