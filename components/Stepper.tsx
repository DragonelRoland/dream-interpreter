type StepperProps = {
  steps: string[]
  currentStep: number
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={step} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  border-2 transition-all duration-200
                  ${
                    isActive
                      ? 'border-white bg-white text-background'
                      : isCompleted
                      ? 'border-gray-400 bg-gray-400 text-background'
                      : 'border-gray-600 bg-transparent text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              <span
                className={`
                  ml-3 text-sm font-medium
                  ${isActive ? 'text-white' : 'text-gray-400'}
                `}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  w-16 h-0.5 mx-4
                  ${isCompleted ? 'bg-gray-400' : 'bg-gray-600'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

