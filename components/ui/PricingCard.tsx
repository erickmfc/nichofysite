'use client'

import React from 'react'
import { Button } from './Button'

interface PricingFeature {
  text: string
  included: boolean
  tooltip?: string
}

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: PricingFeature[]
  popular?: boolean
  paymentLink?: string
  contactSales?: boolean
  highlight?: string
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  popular = false,
  paymentLink,
  contactSales = false,
  highlight
}) => {
  return (
    <div className={`relative p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${
      popular ? 'border-2 border-primary-600 scale-105' : 'border border-gray-200'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
            Mais Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          {price}
        </div>
        <p className="text-gray-700">{description}</p>
        {highlight && (
          <div className="mt-4 p-2 bg-primary-50 rounded-lg text-primary-700 text-sm">
            {highlight}
          </div>
        )}
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 group">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
              feature.included ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {feature.included ? '✓' : '×'}
            </span>
            <span className={`${feature.included ? 'text-gray-900' : 'text-gray-600'} group-hover:text-primary-600 transition-colors`}>
              {feature.text}
            </span>
            {feature.tooltip && (
              <span className="ml-2 text-gray-400 cursor-help" title={feature.tooltip}>
                ℹ️
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {contactSales ? (
          <Button 
            variant="outline" 
            className="w-full hover:bg-primary-50 hover:text-primary-600 transition-colors" 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = 'mailto:comercial@nichofy.com'
              }
            }}
          >
            Contato Comercial
          </Button>
        ) : paymentLink ? (
          <Button 
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300" 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = paymentLink
              }
            }}
          >
            Saiba Mais
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            Ver Preços
          </Button>
        )}
      </div>
    </div>
  )
} 