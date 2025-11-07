export interface ShareContract {
  id: string;
  iTwinId: string;
  shareKey: string;
  shareContract: string;
  expiration: string;
}

export interface SingleShareContractResponse {
  share:  ShareContract;
}

export interface MultiShareContractResponse {
  shares: ShareContract[];
}
