// lib/utils/validation.ts
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  message?: string
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export class Validator {
  private schema: ValidationSchema

  constructor(schema: ValidationSchema) {
    this.schema = schema
  }

  validate(data: Record<string, any>): ValidationResult {
    const errors: Record<string, string> = {}

    for (const [field, rules] of Object.entries(this.schema)) {
      const value = data[field]
      const error = this.validateField(field, value, rules)
      
      if (error) {
        errors[field] = error
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  private validateField(field: string, value: any, rules: ValidationRule): string | null {
    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return rules.message || `${field} é obrigatório`
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === '') {
      return null
    }

    // Min length validation
    if (rules.minLength && value.toString().length < rules.minLength) {
      return rules.message || `${field} deve ter pelo menos ${rules.minLength} caracteres`
    }

    // Max length validation
    if (rules.maxLength && value.toString().length > rules.maxLength) {
      return rules.message || `${field} deve ter no máximo ${rules.maxLength} caracteres`
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value.toString())) {
      return rules.message || `${field} tem formato inválido`
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value)
      if (customError) {
        return customError
      }
    }

    return null
  }
}

// Schemas de validação específicos
export const loginSchema: ValidationSchema = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Senha deve ter pelo menos 6 caracteres'
  }
}

export const contactSchema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
    message: 'Nome deve conter apenas letras e espaços'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  phone: {
    required: true,
    pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    message: 'Telefone deve estar no formato (11) 99999-9999'
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    message: 'Mensagem deve ter entre 10 e 1000 caracteres'
  }
}

export const contentSchema: ValidationSchema = {
  title: {
    required: true,
    minLength: 5,
    maxLength: 200,
    message: 'Título deve ter entre 5 e 200 caracteres'
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 2000,
    message: 'Descrição deve ter entre 20 e 2000 caracteres'
  },
  category: {
    required: true,
    message: 'Categoria é obrigatória'
  }
}

export const adminLoginSchema: ValidationSchema = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  password: {
    required: true,
    minLength: 8,
    message: 'Senha deve ter pelo menos 8 caracteres'
  }
}

// Função utilitária para sanitizar strings
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
    .replace(/\s+/g, ' ') // Normaliza espaços
}

// Função para validar e sanitizar dados
export function validateAndSanitize<T extends Record<string, any>>(
  data: T,
  schema: ValidationSchema
): { isValid: boolean; data: T; errors: Record<string, string> } {
  const validator = new Validator(schema)
  const result = validator.validate(data)
  
  // Sanitizar dados válidos
  const sanitizedData = { ...data }
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitizedData[key] = sanitizeString(value)
    }
  }

  return {
    isValid: result.isValid,
    data: sanitizedData,
    errors: result.errors
  }
}
