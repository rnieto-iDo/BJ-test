const config = {
  credentials: {
    preview: {
      orgId: process.env.THREEKIT_ORG_ID ?? "",
      publicToken: process.env.THREEKIT_PUBLIC_TOKEN ?? "",
    },
    // 'admin-fts': {
    //     orgId: process.env.THREEKIT_ADMIN_FTS_ORG_ID,
    //     publicToken: process.env.THREEKIT_ADMIN_FTS_PUBLIC_TOKEN,
    // },
  },

  products: {
    preview: {
      assetId: process.env.THREEKIT_ASSET_ID,
      configurationId: undefined,
      stageId: undefined,
    },
    // 'admin-fts': {
    //     assetId: undefined,
    //     configurationId: undefined,
    //     stageId: undefined,
    // },
  },
};

export default config;
