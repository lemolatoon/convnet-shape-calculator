import getConfig from "next/config";

type PublicRuntimeConfig = {
  urlPrefix: string;
  fullUrl: string;
};

export const assetUrl = (filename: string) => {
  const { publicRuntimeConfig } = getConfig() as {
    publicRuntimeConfig: PublicRuntimeConfig;
  };
  return `${publicRuntimeConfig.urlPrefix}${filename}`;
};

export const assetFullUrl = (filename: string) => {
  const { publicRuntimeConfig } = getConfig() as {
    publicRuntimeConfig: PublicRuntimeConfig;
  };
  return `${publicRuntimeConfig.fullUrl}${filename}`;
};
