'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { useState, useEffect } from 'react'

interface ChartData {
  label: string
  value: number
  color: string
  percentage: number
}

interface SimpleChartProps {
  data: ChartData[]
  title: string
  type: 'bar' | 'pie' | 'line' | 'progress'
  height?: number
  showValues?: boolean
  showPercentages?: boolean
}

export const SimpleChart = ({ 
  data, 
  title, 
  type, 
  height = 200, 
  showValues = true, 
  showPercentages = true 
}: SimpleChartProps) => {
  const { theme } = useTheme()
  const [animatedData, setAnimatedData] = useState<ChartData[]>([])

  // Animar dados
  useEffect(() => {
    const animateData = data.map(item => ({
      ...item,
      animatedValue: 0,
      animatedPercentage: 0
    }))

    const animate = () => {
      setAnimatedData(prev => prev.map((item, index) => {
        const target = data[index]
        const progress = Math.min(1, (Date.now() - startTime) / 1000)
        
        return {
          ...item,
          animatedValue: target.value * progress,
          animatedPercentage: target.percentage * progress
        }
      }))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const startTime = Date.now()
    setAnimatedData(animateData)
    animate()
  }, [data])

  const maxValue = Math.max(...data.map(d => d.value))

  const renderBarChart = () => (
    <div className="space-y-3">
      {animatedData.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {item.label}
            </span>
            <div className="flex items-center space-x-2">
              {showValues && (
                <span className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {Math.round(item.animatedValue)}
                </span>
              )}
              {showPercentages && (
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {Math.round(item.animatedPercentage)}%
                </span>
              )}
            </div>
          </div>
          <div className={`w-full rounded-full h-3 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div
              className={`h-3 rounded-full transition-all duration-1000 ease-out`}
              style={{
                width: `${(item.animatedValue / maxValue) * 100}%`,
                backgroundColor: item.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )

  const renderPieChart = () => {
    let cumulativePercentage = 0
    
    return (
      <div className="relative" style={{ width: height, height }}>
        <svg width={height} height={height} className="transform -rotate-90">
          {animatedData.map((item, index) => {
            const startAngle = cumulativePercentage * 3.6 // 360/100
            const endAngle = (cumulativePercentage + item.animatedPercentage) * 3.6
            cumulativePercentage += item.animatedPercentage
            
            const radius = height / 2 - 10
            const x1 = height / 2 + radius * Math.cos((startAngle * Math.PI) / 180)
            const y1 = height / 2 + radius * Math.sin((startAngle * Math.PI) / 180)
            const x2 = height / 2 + radius * Math.cos((endAngle * Math.PI) / 180)
            const y2 = height / 2 + radius * Math.sin((endAngle * Math.PI) / 180)
            
            const largeArcFlag = item.animatedPercentage > 50 ? 1 : 0
            
            const pathData = [
              `M ${height / 2} ${height / 2}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                className="transition-all duration-1000 ease-out"
              />
            )
          })}
        </svg>
        
        {/* Legenda */}
        <div className="absolute bottom-0 left-0 right-0 space-y-1">
          {animatedData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {item.label}
                </span>
              </div>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                {Math.round(item.animatedPercentage)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderLineChart = () => (
    <div className="space-y-4">
      <div className="relative" style={{ height }}>
        <svg width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value, index) => (
            <line
              key={index}
              x1="0"
              y1={height - (value / 100) * height}
              x2="100%"
              y2={height - (value / 100) * height}
              stroke={theme === 'dark' ? '#374151' : '#E5E7EB'}
              strokeWidth="1"
            />
          ))}
          
          {/* Data line */}
          <polyline
            points={animatedData.map((item, index) => 
              `${(index / (animatedData.length - 1)) * 100}%,${height - (item.animatedPercentage / 100) * height}`
            ).join(' ')}
            fill="none"
            stroke={animatedData[0]?.color || '#3B82F6'}
            strokeWidth="3"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Data points */}
          {animatedData.map((item, index) => (
            <circle
              key={index}
              cx={`${(index / (animatedData.length - 1)) * 100}%`}
              cy={height - (item.animatedPercentage / 100) * height}
              r="4"
              fill={item.color}
              className="transition-all duration-1000 ease-out"
            />
          ))}
        </svg>
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs">
        {animatedData.map((item, index) => (
          <span key={index} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )

  const renderProgressChart = () => (
    <div className="space-y-4">
      {animatedData.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {item.label}
            </span>
            <span className={`text-sm font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {Math.round(item.animatedPercentage)}%
            </span>
          </div>
          <div className={`w-full rounded-full h-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div
              className={`h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
              style={{
                width: `${item.animatedPercentage}%`,
                backgroundColor: item.color
              }}
            >
              {showValues && item.animatedPercentage > 20 && (
                <span className="text-xs font-bold text-white">
                  {Math.round(item.animatedValue)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart()
      case 'pie':
        return renderPieChart()
      case 'line':
        return renderLineChart()
      case 'progress':
        return renderProgressChart()
      default:
        return renderBarChart()
    }
  }

  return (
    <div className={`rounded-xl p-4 ${
      theme === 'dark' 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      {renderChart()}
    </div>
  )
}

// Componente para gráfico de progresso de metas
interface GoalProgressChartProps {
  goals: Array<{
    id: string
    title: string
    progress: number
    color: string
  }>
}

export const GoalProgressChart = ({ goals }: GoalProgressChartProps) => {
  const chartData: ChartData[] = goals.map(goal => ({
    label: goal.title,
    value: goal.progress,
    color: goal.color,
    percentage: goal.progress
  }))

  return (
    <SimpleChart
      data={chartData}
      title="Progresso das Metas"
      type="progress"
      showValues={false}
      showPercentages={true}
    />
  )
}

// Componente para gráfico de categorias
interface CategoryChartProps {
  categories: Array<{
    name: string
    count: number
    color: string
  }>
}

export const CategoryChart = ({ categories }: CategoryChartProps) => {
  const total = categories.reduce((sum, cat) => sum + cat.count, 0)
  
  const chartData: ChartData[] = categories.map(cat => ({
    label: cat.name,
    value: cat.count,
    color: cat.color,
    percentage: total > 0 ? (cat.count / total) * 100 : 0
  }))

  return (
    <SimpleChart
      data={chartData}
      title="Posts por Categoria"
      type="pie"
      height={250}
      showValues={true}
      showPercentages={true}
    />
  )
}

// Componente para gráfico de tendência temporal
interface TrendChartProps {
  data: Array<{
    period: string
    value: number
    color: string
  }>
}

export const TrendChart = ({ data }: TrendChartProps) => {
  const chartData: ChartData[] = data.map(item => ({
    label: item.period,
    value: item.value,
    color: item.color,
    percentage: item.value // Para gráfico de linha, usar valor direto
  }))

  return (
    <SimpleChart
      data={chartData}
      title="Tendência de Performance"
      type="line"
      height={200}
      showValues={false}
      showPercentages={false}
    />
  )
}
