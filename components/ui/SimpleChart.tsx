'use client'

import React from 'react'

interface SimpleChartProps {
  data: number[]
  labels?: string[]
  title?: string
  type?: 'bar' | 'line' | 'area'
  color?: string
  height?: number
  className?: string
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  labels,
  title,
  type = 'bar',
  color = '#3B82F6',
  height = 200,
  className = ''
}) => {
  // Verificar se há dados válidos
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div className="flex items-center justify-center h-48 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      </div>
    )
  }

  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue

  const getBarChart = () => (
    <div className="flex items-end space-x-2 h-full">
      {data.map((value, index) => {
        const percentage = range > 0 ? ((value - minValue) / range) * 100 : 50
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t transition-all duration-500 ease-out"
              style={{ 
                height: `${percentage}%`,
                backgroundColor: color,
                minHeight: '4px'
              }}
            />
            {labels && labels[index] && (
              <span className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                {labels[index]}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )

  const getLineChart = () => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = range > 0 ? 100 - (((value - minValue) / range) * 100) : 50
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="relative h-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
            className="transition-all duration-500 ease-out"
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = range > 0 ? 100 - (((value - minValue) / range) * 100) : 50
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={color}
                className="transition-all duration-500 ease-out"
              />
            )
          })}
        </svg>
        {labels && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
            {labels.map((label, index) => (
              <span key={index} className="truncate">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  const getAreaChart = () => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = range > 0 ? 100 - (((value - minValue) / range) * 100) : 50
      return `${x},${y}`
    }).join(' ')

    const areaPath = `M 0,100 L ${points} L 100,100 Z`

    return (
      <div className="relative h-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={areaPath}
            fill={color}
            fillOpacity="0.3"
            className="transition-all duration-500 ease-out"
          />
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {labels && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
            {labels.map((label, index) => (
              <span key={index} className="truncate">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return getLineChart()
      case 'area':
        return getAreaChart()
      default:
        return getBarChart()
    }
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div style={{ height: `${height}px` }}>
        {data.length > 0 ? (
          renderChart()
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>Nenhum dado disponível</p>
            </div>
          </div>
        )}
      </div>
      
      {data.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Min: {minValue.toLocaleString()}</span>
          <span>Max: {maxValue.toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}

// Componente de gráfico de pizza simples
export const SimplePieChart: React.FC<{
  data: Array<{ label: string; value: number; color?: string }>
  title?: string
  size?: number
  className?: string
}> = ({ data, title, size = 200, className = '' }) => {
  // Verificar se há dados válidos
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div className="flex items-center justify-center h-48 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">🥧</div>
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  let cumulativePercentage = 0

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const startAngle = (cumulativePercentage / 100) * 360
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360
            
            cumulativePercentage += percentage

            const radius = size / 2 - 10
            const centerX = size / 2
            const centerY = size / 2

            const startAngleRad = (startAngle * Math.PI) / 180
            const endAngleRad = (endAngle * Math.PI) / 180

            const x1 = centerX + radius * Math.cos(startAngleRad)
            const y1 = centerY + radius * Math.sin(startAngleRad)
            const x2 = centerX + radius * Math.cos(endAngleRad)
            const y2 = centerY + radius * Math.sin(endAngleRad)

            const largeArcFlag = percentage > 50 ? 1 : 0

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color || colors[index % colors.length]}
                className="transition-all duration-500 ease-out hover:opacity-80"
              />
            )
          })}
        </svg>
      </div>
      
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <span className="text-gray-700">{item.label}</span>
            </div>
            <span className="text-gray-600 font-medium">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}