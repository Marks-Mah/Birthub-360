export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning';
  message: string;
  nodeId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
}

export const validationEngine = {
  validate: (_nodes: any[], _edges: any[]): ValidationResult => {
    return {
      isValid: true,
      issues: [],
    };
  },
};
