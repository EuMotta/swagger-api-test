/**
 * Utilitários para manipulação e validação de dados no sistema.
 *
 * Este módulo fornece funções auxiliares para conversão e validação de tipos de dados,
 * incluindo strings, números, booleanos, datas e IDs do MongoDB.
 *
 * Funcionalidades incluídas:
 * - Conversão segura de valores para string, número e booleano.
 * - Validação e conversão de ObjectId do MongoDB.
 * - Manipulação de arrays e endereços de clientes/pedidos.
 * - Normalização de informações do navegador e localização.
 *
 * @module DataUtils
 */

import mongoose from 'mongoose';

/**
 * Converte um valor para string, garantindo que o retorno seja uma string válida.
 *
 * @param {any} value - Valor a ser convertido.
 * @returns {string} Retorna o valor convertido em string.
 */
const getString = (value: any) => (value || '').toString();

/**
 * Converte um valor para Date se for uma data válida.
 *
 * @param {any} value - Valor a ser convertido para data.
 * @returns {Date | null} Retorna um objeto Date válido ou null se a conversão falhar.
 */
const getDateIfValid = (value: any) => {
  const date = Date.parse(value);
  return Number.isNaN(date) ? null : new Date(date);
};

/**
 * Retorna um array válido se o valor fornecido for um array.
 *
 * @param {any} value - Valor a ser verificado.
 * @returns {any[] | null} Retorna o array original ou null se não for um array.
 */
const getArrayIfValid = (value: any) => (Array.isArray(value) ? value : null);

/**
 * Converte um valor para um ObjectId válido do MongoDB.
 *
 * @param {any} value - Valor a ser convertido.
 * @returns {mongoose.Types.ObjectId | null} Retorna um ObjectId válido ou null se a conversão falhar.
 */
const getObjectIDIfValid = (value: any) =>
  mongoose.Types.ObjectId.isValid(value)
    ? new mongoose.Types.ObjectId(value)
    : null;

/**
 * Converte um array de valores para um array de ObjectIds válidos.
 *
 * @param {any} value - Array contendo os valores a serem convertidos.
 * @returns {mongoose.Types.ObjectId[]} Retorna um array de ObjectIds válidos.
 */
const getArrayOfObjectID = (value: any) => {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((id) => getObjectIDIfValid(id)).filter((id) => !!id);
  }
  return [];
};

/**
 * Verifica se um valor é um número válido.
 *
 * @param {any} value - Valor a ser validado.
 * @returns {boolean} Retorna `true` se for um número válido, `false` caso contrário.
 */
const isNumber = (value: any) =>
  !Number.isNaN(Number(parseFloat(value))) && Number.isFinite(Number(value));

/**
 * Converte um valor para número se for válido.
 *
 * @param {any} value - Valor a ser convertido.
 * @returns {number | null} Retorna o número convertido ou null se não for válido.
 */
const getNumberIfValid = (value: any) =>
  isNumber(value) ? parseFloat(value) : null;

/**
 * Converte um valor para número se for positivo.
 *
 * @param {any} value - Valor a ser convertido.
 * @returns {number | null} Retorna o número positivo ou null se for inválido.
 */
const getNumberIfPositive = (value: any) => {
  const n = getNumberIfValid(value);
  return n && n >= 0 ? n : null;
};

/**
 * Converte um valor para booleano se for válido, com opção de valor padrão.
 *
 * @param {any} value - Valor a ser convertido.
 * @param {boolean | null} [defaultValue=null] - Valor padrão caso a conversão falhe.
 * @returns {boolean | null} Retorna um booleano ou o valor padrão fornecido.
 */
const getBooleanIfValid = (value: any, defaultValue: boolean | null = null) => {
  if (value === 'true' || value === 'false') return value === 'true';
  return typeof value === 'boolean' ? value : defaultValue;
};

/**
 * Normaliza informações do navegador a partir do objeto de entrada.
 *
 * @param {any} browser - Objeto contendo informações do navegador.
 * @returns {object} Retorna um objeto com `ip` e `user_agent` normalizados.
 */

const getBrowser = (browser: any) =>
  browser
    ? {
        ip: getString(browser.ip),
        user_agent: getString(browser.user_agent),
      }
    : {
        ip: '',
        user_agent: '',
      };

/**
 * Converte e normaliza um endereço de cliente para um formato padronizado.
 *
 * @param {any} address - Objeto contendo os dados do endereço.
 * @returns {object} Retorna o endereço normalizado com ObjectId gerado.
 */

export default {
  getString,
  getObjectIDIfValid,
  getDateIfValid,
  getArrayIfValid,
  getArrayOfObjectID,
  getNumberIfValid,
  getNumberIfPositive,
  getBooleanIfValid,
  getBrowser,
};
