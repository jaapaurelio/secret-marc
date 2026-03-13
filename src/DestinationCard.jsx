function DestinationCard({
  image,
  message,
  body,
  countdown,
  isComplete = false,
  actionLabel,
  onAction,
}) {
  return (
    <main className="page countdown-page" aria-label="Destination page">
      <section className="countdown-shell">
        <img className="countdown-marc" src={image} alt="" aria-hidden="true" />
        <p className="countdown-message">{message}</p>
        <p className="countdown-riddle">{body}</p>
        {countdown ? (
          <div className="countdown-readout" aria-live="polite">
            <span>{countdown.hours} hours</span>
            <span>{countdown.minutes} min</span>
            <span>{countdown.seconds} sec</span>
          </div>
        ) : null}
        {isComplete ? <p className="countdown-finished">Time.</p> : null}
        {actionLabel && onAction ? (
          <button type="button" className="countdown-action" onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </section>
    </main>
  )
}

export default DestinationCard
