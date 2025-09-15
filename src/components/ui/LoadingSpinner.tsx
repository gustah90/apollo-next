interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
}

export default function LoadingSpinner({ size = 'large' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin`}
      ></div>
    </div>
  )
}
