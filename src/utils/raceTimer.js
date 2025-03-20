import { TIMER_CONSTANTS } from '@/constants/puppyRace'

export function createTimer(onTick) {
  return window.setInterval(onTick, TIMER_CONSTANTS.UPDATE_INTERVAL)
}

export function clearTimer(timerId) {
  window.clearInterval(timerId)
}

export function startCountdown(duration, onTick, onComplete) {
  let remaining = duration
  onTick(remaining)

  const timerId = window.setInterval(() => {
    remaining -= TIMER_CONSTANTS.UPDATE_INTERVAL
    onTick(remaining)

    if (remaining <= 0) {
      clearTimer(timerId)
      onComplete()
    }
  }, TIMER_CONSTANTS.UPDATE_INTERVAL)

  return timerId
}

export function updateRaceState(state, elapsedTime) {
  return {
    ...state,
    startTime: state.startTime || Date.now(),
    endTime: state.isFinished ? state.endTime || Date.now() : null,
    winner: state.isFinished ? state.winner : null
  }
}

export function checkRaceFinish(state, puppies) {
  if (state.isFinished) return true

  const finishedPuppies = puppies.filter(puppy => puppy.position >= 100)
  if (finishedPuppies.length > 0) {
    return true
  }

  return false
}

export function getRaceWinner(puppies) {
  const finishedPuppies = puppies
    .filter(puppy => puppy.position >= 100)
    .sort((a, b) => a.position - b.position)

  return finishedPuppies[0]?.color || null
}

export function resetRaceState() {
  return {
    isRunning: false,
    isFinished: false,
    startTime: null,
    endTime: null,
    winner: null
  }
}

export function calculateRaceTime(state) {
  if (!state.startTime) return 0
  const endTime = state.endTime || Date.now()
  return endTime - state.startTime
}

export function isRaceTimeout(state, maxTime) {
  if (!state.startTime) return false
  const currentTime = Date.now()
  return currentTime - state.startTime > maxTime
}

export function pauseRace(state) {
  return {
    ...state,
    isRunning: false
  }
}

export function resumeRace(state) {
  return {
    ...state,
    isRunning: true
  }
} 