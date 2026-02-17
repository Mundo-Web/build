import documentTypes from "../../../storage/app/utils/document_types.json";

/**
 * Validates a document number based on its type.
 * @param {string} type - The document type code (e.g., '01', '06').
 * @param {string} value - The document number to validate.
 * @returns {Object} - { isValid: boolean, message: string, maxLength: number }
 */
export const validateDocument = (type, value) => {
  const docType = documentTypes.find(t => t.id === type || t.type_code === type);
  
  if (!docType) {
    return { isValid: true, message: "", maxLength: 15 };
  }

  const maxLength = docType.length;
  const currentLength = value.length;

  if (currentLength > maxLength) {
    return { 
      isValid: false, 
      message: `El ${docType.short_name} no debe exceder los ${maxLength} caracteres.`,
      maxLength 
    };
  }

  // Optional: Add specific pattern validation if needed in the future
  // e.g., DNI should be numeric, RUC starts with 10/20, etc.

  return { isValid: true, message: "", maxLength };
};

export const getDocumentTypesOptions = () => {
  return documentTypes.map(t => ({
    value: t.id,
    label: t.name
  }));
};

export default documentTypes;
