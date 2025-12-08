export interface PlayRequest {
  file: string;
  offset: number;
  length: number;
}

export interface PlayResponse {
  data: number[];
}

export interface SetPriceRequest {
  price: string;
}

/**
 * The response from Tunity API
 * @template T - The type of the data
 * @template E - The type of the error
 */
export interface ApiResponse<T, E> {  
  /** The status of the response */
  status: "Success" | "Error" | "PaymentRequired";
  /** The data of the response */
  data: T | E;
}

export interface X402PaymentPayload {
  x402Version: number;
  scheme: string;
  network: string;
  payload: {
    signature: string;
    authorization: {
      from: string;
      to: string;
      value: string;
      validAfter: string;
      validBefore: string;
      nonce: string;
    };
  };
}