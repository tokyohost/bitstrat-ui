export default {
  // 路由国际化
  route: {
    dashboard: 'Dashboard',
    document: 'Document'
  },
  // 登录页面国际化
  login: {
    selectPlaceholder: 'Please select/enter a company name',
    username: 'Username',
    password: 'Password',
    email: 'Email',
    login: 'Login',
    logging: 'Logging...',
    code: 'Verification Code',
    rememberPassword: 'Remember me',
    switchRegisterPage: 'Sign up now',
    rule: {
      agreement: {
        required: 'Please read and agree to the User Agreement.'
      },
      tenantId: {
        required: 'Please enter your tenant id'
      },
      username: {
        required: 'Please enter your account'
      },
      password: {
        required: 'Please enter your password'
      },
      code: {
        required: 'Please enter a verification code'
      }
    },
    social: {
      wechat: 'Wechat Login',
      maxkey: 'MaxKey Login',
      topiam: 'TopIam Login',
      gitee: 'Gitee Login',
      github: 'Github Login'
    }
  },
  // 注册页面国际化
  register: {
    selectPlaceholder: 'Please select/enter a company name',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    invitationCode: 'Invitation Code',
    register: 'Register',
    registering: 'Registering...',
    registerSuccess: 'Congratulations, your {username} account has been registered!',
    code: 'Verification Code',
    switchLoginPage: 'Log in with an existing account',
    rule: {
      tenantId: {
        required: 'Please enter your tenant id'
      },
      username: {
        required: 'Please enter your account',
        length: 'The length of the user account must be between {min} and {max}'
      },
      password: {
        required: 'Please enter your password',
        length: 'The user password must be between {min} and {max} in length',
        pattern: "Can't contain illegal characters: {strings}"
      },
      code: {
        required: 'Please enter a verification code'
      },
      confirmPassword: {
        required: 'Please enter your password again',
        equalToPassword: 'The password entered twice is inconsistent'
      },
      invitationCode: {
        required: 'Please enter the invitation code'
      },
      email: {
        required: 'Please enter your email',
        invalid: 'Please enter a valid email address'
      }
    }
  },
  // 导航栏国际化
  navbar: {
    full: 'Full Screen',
    language: 'Language',
    dashboard: 'Dashboard',
    document: 'Document',
    message: 'Message',
    layoutSize: 'Layout Size',
    selectTenant: 'Select Tenant',
    layoutSetting: 'Layout Setting',
    personalCenter: 'Personal Center',
    apiSetting: 'API Setting',
    socketStatus: 'WebSocket Connection Status',
    logout: 'Logout',
    notifySetting: 'Notification Settings'
  },
  setting: {
    api: {
      未设置: 'Not Set',
      已设置: 'Configured'
    },
    apiSettingForm: {
      apiKey: 'API Key',
      secret: 'API Secret',
      passphrase: 'Passphrase',
      title: 'Settings',
      succ: 'Configuration successful',
      checkFail: 'Validation failed, please check if API settings are correct'
    },
    socketStatus: {
      title: 'Warning',
      reconnectConfirm: 'Reconnection will be triggered. Continue?',
      ok: 'OK',
      cancel: 'Cancel',
      done: 'Triggered !'
    }
  },
  //menu 国际化
  menu: {
    首页: 'Home',
    用户管理: 'Users',
    系统管理: 'System',
    资金费套利: 'Funding Fee Arbitrage',
    跨交易所套利: 'Cross-Exchange Arbitrage',
    现货套利: 'Spot Arbitrage',
    跨交易所套利任务: 'Cross-Exchange Arbitrage Task',
    跨交易所套利警告: 'Cross-Exchange Arbitrage Alert',
    跨交易所订单: 'Cross-Exchange Orders',
    通知配置: 'Notification Settings',
    分批出入场: 'Batch Entry/Exit',
    租户管理: 'Tenant Management',
    系统监控: 'System Monitoring',
    系统工具: 'System Tools',
    AI策略: 'AI Strategies',
    任务管理: 'Task Management',
    'AI任务中心': 'AI Task Center',
    'AI智能分析': 'AI Intelligent Analysis',
    '策略广场': 'Strategy Hub'
  },
  //通用
  common: {
    direction: {
      long: 'Long',
      short: 'Short',
      tpsl: 'TP/SL',
      hold: 'hold',
      close: 'Close',
      nothing: 'Nothing'
    },
    opt: {
      search: 'Search',
      reset: 'Reset',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      export: 'Export',
      show: 'Detail',
      opt: 'Action',
      stop: 'Stop',
      start: 'Start',
      log: 'logger',
      editRole: 'Edit Role'
    },
    dialog: {
      confirm: 'Confirm',
      cancel: 'Cancel'
    }
  },
  bybit: {
    task: {
      status: {
        已创建: 'Created',
        正在运行: 'Running',
        已终止: 'Stopped'
      },
      title: {
        add: 'Create Task',
        edit: 'Edit Task',
        editRole: 'Edit Role',
        show: 'Task Detail',
        log: 'Task Log'
      },
      form: {
        id: 'id',
        name: 'Task Name',
        symbol: 'Coins Name',
        singleOrder: 'Order Limit',
        balance: 'Position',
        coldSec: 'Cooldown Time',
        totalBalance: 'Available Credit',
        taskType: 'Type'
      },
      table: {
        id: 'id',
        name: 'Name',
        symbol: 'Coins Name',
        balance: 'Position',
        singleOrder: 'Order Limit',
        coldSec: 'Cooldown Time',
        totalBalance: 'Available Credit',
        lastOrderTime: 'Last Order Time',
        taskType: 'Type',
        createUserName: 'Create',
        status: 'Status',
        avgPrice: 'Average Position Price',
        positionValue: 'Position Value',
        markPrice: 'Market Price',
        unrealisedPnl: 'Profit and Loss'
      },
      placeholder: {
        id: '',
        name: 'please enter your task name',
        symbol: 'please select coins name'
      },
      rule: {
        id: 'id can not be empty',
        name: 'task name cannot be empty',
        symbol: 'symbol cannot be empty'
      }
    }
  },
  home: {
    aiStrategy: {
      title: 'AI Strategy',
      desc: 'Intelligent quantitative and automated trading assistant tools'
    },
    aiSummary: {
      title: 'AI Analysis',
      desc: 'Smart analysis of positions and market trends helper'
    },
    feed: {
      title: 'Strategy Square',
      desc: 'Discover more strategies'
    },
    more: {
      title: 'More features coming soon',
      desc: 'We are preparing more exciting content for you...'
    },
    totalAmount: {
      title: 'Total Asset Trend Statistics'
    },
    dailyGrowthChart: {
      title: 'Daily Growth Statistics',
      item: 'Growth Percentage'
    },
    predictedRateOfReturn: {
      title: 'Predicted Rate of Return',
      item: '-Day Return (Annualized)'
    }
  },
  cryptoSlogan: {
    sloganSplit1: 'Your key will be encrypted and stored using',
    sloganSplit2: 'PKCS1_OAEP',
    sloganSplit3: 'technology.'
  },
  agreement: {
    'checkbox_text': 'I have read and agree to the',
    'link_text': 'Bitstrat Platform User Disclaimer',
    'modal_title': 'Bitstrat Platform User Disclaimer',
    'last_updated': 'Last updated: 2025-12-4',
    'intro':
      'Welcome to this platform (hereinafter referred to as the “Platform”). Before using the AI technology services provided by the Platform, you must carefully read and fully understand this Disclaimer. By continuing to use the Platform or submitting an API Key, you acknowledge and fully agree to the following:',
    'section_1_title': '1. Platform Nature',
    'section_1_content':
      'The Platform only provides: AI model calling and prompt execution capabilities, API Key management tools, strategy generation, and automated execution interfaces. The Platform does not provide investment advice, financial services, or asset management business, nor does it conduct operations on behalf of clients.',
    'section_2_title': '2. User API Key Authorization',
    'section_2_content':
      "Any virtual currency exchange API Key used by the user on the Platform is created, authorized, and managed by the user. The permissions, risks, and independent control of the API Key are entirely borne by the user. The Platform will not save, disclose, or misuse the user's API Key, but the user must ensure that the API Key has a reasonable scope of permissions (such as trading-only permission, without withdrawal permission)).",
    'section_3_title': '3. AI Behavior and Results',
    'section_3_content':
      "The user writes the prompt (Prompt) and the Platform's AI engine executes the trading API request according to the prompt. Any actions, transactions, order placements, cancellations, position adjustments, etc., executed by the AI are considered to be initiated by the user. The Platform is not responsible for losses caused by AI's misunderstanding, judgment errors, communication anomalies, transaction failures, or delays.",
    'section_4_title': '4. Trading Risk Warning',
    'section_4_content':
      'Digital asset trading involves high risks, including but not limited to: severe price fluctuations, system anomalies, API failures, strategy failures, and market risks. Using AI for automated trading involves additional unpredictable risks, including: model output deviations, strategy logic errors, prompt ambiguity, and system identification errors. Any account asset loss, reduction in returns, order errors, or position liquidation caused by any of the above reasons shall be borne by the user.',
    'section_5_title': '5. Fee Terms',
    'section_5_content':
      "The Platform charges fees based on AI Token usage, which is unrelated to the user's trading results. The Platform does not participate in revenue sharing, does not charge transaction fees, and has no growth-based income. After the user recharges or incurs fees, the Platform does not guarantee any returns based on the AI's results or performance.",
    'section_6_title': '6. Compliance and Use Restrictions',
    'section_6_content':
      'Users must not use the Platform for any illegal activities, including but not limited to money laundering, cash arbitrage, darknet transactions, etc. Users should ensure that the exchange APIs, strategies, and actions involved in using this Platform comply with local laws and regulations. Account operations that violate laws or regulatory requirements are solely the responsibility of the user.',
    'section_7_title': '7. Disclaimer Clauses',
    'section_7_list_1': 'Any direct or indirect loss caused by the AI model output',
    'section_7_list_2': "Risks caused by user's incorrect API Key configuration or excessive authorization",
    'section_7_list_3': 'System failures caused by network, exchange, server, third-party API, etc.',
    'section_7_list_4': "Losses caused by user's own strategy or prompt logic",
    'section_7_list_5': 'Transaction failures or data loss caused by force majeure',
    'section_8_title': '8. User Commitment',
    'section_8_content':
      "The user commits to: assuming full responsibility for their own transactions, making independent judgments on the AI model's output, not treating the Platform's services as investment advice, guaranteeing the legality and security of the API Key, and agreeing to all Platform fee strategies and calling billing rules.",
    'section_9_title': '9. Final Interpretation Right',
    'section_9_content': 'The Platform reserves the right of final interpretation and the right to modify this Disclaimer at any time.',
    'confirm_button': 'I Acknowledge',
    'required_error': 'Please read and agree to the user agreement'
  },
  accountSelect: {
    form: {
      apiKey: 'API Key',
      name: 'Name',
      exchange: 'Exchange'
    },
    placeholder: {
      apiKey: 'Please enter API KEY',
      name: 'Please enter API name',
      exchange: 'Please select exchange'
    },
    table: {
      exchange: 'Exchange',
      name: 'Name',
      apiKey: 'API Key',
      balance: 'Total Balance',
      freeBalance: 'Free Balance',
      type: 'Type',
      createTime: 'Created Time'
    },
    action: {
      syncBalance: 'Update Balance',
      select: 'Select',
      save: 'Save'
    }
  },
  accountSelectDialog: {
    title: 'API Setting',
    action: {
      close: 'Close'
    }
  },
  positionWidget: {
    full: 'Full',
    positionSize: 'Position Size',
    avgPrice: 'Average Entry Price',
    unrealizedProfit: 'Unrealized Profit/Loss',
    realizedProfit: 'Realized Profit/Loss',
    margin: 'Margin',
    marginRatio: 'Maintenance Margin Ratio',
    liqPrice: 'Est. Liquidation Price',
    syncTime: 'Sync Time',
    updateTime: 'Position Update Time',
    tpslOrder: 'TP/SL Order',
    leverage: 'Leverage',
    marginType: 'Margin Type'
  },
  feedPage: {
    title: 'Strategy Plaza Beta',
    subtitle: 'Share Your Top Strategies',
    profit3m: '3-Month Return',
    likes: 'Likes',
    viewDetails: 'View',
    loadingMore: 'Loading more data...',
    noMore: 'No more data',
    loadNext: 'Load Next Page',
    comingSoon: 'Coming soon'
  },
  sharePanel: {
    title: 'Share Strategy to Strategy Plaza',
    strategyTitle: 'Strategy Title',
    strategyTitlePlaceholder: 'Give it a catchy name',
    introduction: 'Introduction',
    introductionPlaceholder: 'Describe your strategy content',
    strategyTags: 'Strategy Tags',
    selectTags: 'Select tags',
    tagLimit: 'Max 3 tags',
    notice: 'Sharing to the Strategy Plaza will not disclose your prompts or any configuration, only your API profit/loss curve',
    cancel: 'Cancel',
    cancelShare: 'Cancel Share',
    updateShare: 'Update Share',
    share: 'Share',
    rule: {
      title: 'Title cannot be empty',
      titleLength: 'Title must be 4-12 characters',
      content: 'Introduction cannot be empty',
      contentLength: 'Introduction must be 4-200 characters',
      tags: 'Select at least one tag'
    }
  },
  taskItem: {
    view: 'View',
    edit: 'Edit',
    stop: 'Stop',
    start: 'Start',
    delete: 'Delete',
    coins: 'Coins',
    startBalance: 'Start Balance',
    timeGranularity: 'Time Granularity',
    createTime: 'Create Time',
    shared: 'Shared',
    status: {
      已创建: 'Created',
      正在运行: 'Running',
      已终止: 'Stopped'
    }
  },
  aiTask: {
    taskName: 'Task Name',
    taskNamePlaceholder: 'Please enter task name',
    search: 'Search',
    reset: 'Reset',
    createTask: 'Create Task',
    modifyTask: 'Modify Task',
    exchange: 'Exchange',
    selectExchange: 'Please select exchange',
    coins: 'Coins',
    coinsPopoverTitle: 'Coins',
    coinsPopoverContent: 'Coins allowed for AI trading',
    selectCoins: 'Please select coins',
    initialBalance: 'Initial Balance',
    initialBalancePopoverTitle: 'Initial Amount',
    initialBalancePopoverContent:
      'Let AI remember the cost line at the start of trading (try to enter account/sub-account balance, get the entire account USDT balance when getting the balance)',
    aiAgent: 'AI Agent',
    selectAiAgent: 'Please select AI Agent',
    timeGranularity: 'Time Granularity',
    timeGranularityPopoverTitle: 'Time Granularity',
    timeGranularityPopoverContent:
      'How often the system provides market data to AI and waits for AI to make trading decisions (not too short, consider AI thinking time)',
    leverage: 'Leverage Range',
    shortTermIndicator: 'Short Term Indicator',
    shortTermIndicatorPopoverTitle: 'Short Term Indicator',
    shortTermIndicatorPopoverContent: 'Get K-line data as a data source for short-term indicators like EMA/MACD/RSI when calling AI',
    longTermIndicator: 'Long Term Indicator',
    longTermIndicatorPopoverTitle: 'Long Term Indicator',
    longTermIndicatorPopoverContent:
      'Get K-line data as a data source for long-term indicators like EMA/MACD/RSI when calling AI. Note: long-term indicators must be longer than short-term indicators!!',
    basicConfig: 'Basic Configuration',
    accountSelect: 'Account Selection',
    selectAccount: 'Select Account',
    systemPrompt: 'System Prompt',
    systemPromptPlaceholder:
      'Enter system prompt, you can require AI to execute rules, trading logic, trading discipline, etc. It all depends on you, looking forward to your perfect strategy',
    preset1: 'Preset Prompt 1',
    preset2: 'Preset Prompt 2',
    userPrompt: 'User Prompt',
    userPromptPlaceholder: 'Enter your trading ideas, which will be added to the user prompt at the beginning of each API call',
    exampleContent:
      'The following example content is provided to AI as market data, current position data, historical achievements, etc. Currently not modifiable. Your trading ideas will be spliced before the example content:',
    nextStep: 'Next',
    confirm: 'Confirm',
    cancel: 'Cancel',
    minutes: 'minutes',
    usdt: 'USDT',
    rule: {
      taskName: 'Task name cannot be empty',
      exchange: 'Exchange cannot be empty',
      symbols: 'At least one coin must be selected',
      aiAgent: 'Please select AI Agent',
      timeGranularity: 'Please select time granularity',
      apiId: 'Please select API account',
      systemPrompt: 'System prompt cannot be empty',
      leverage: 'Leverage range must be selected',
      longTermInterval: 'Long-term cycle must be greater than short-term cycle',
      shortTermInterval: 'Short-term cycle must be less than long-term cycle',
      initialBalance: 'Initial balance must be filled',
      initialBalanceLessThan10: 'Initial balance cannot be less than 10'
    },
    message: {
      success: 'Operation successful',
      deleteConfirm: 'Are you sure you want to delete the AI task with ID "{id}"?',
      deleteSuccess: 'Deletion successful',
      selectExchangeFirst: 'Please select exchange first'
    }
  },
  aiCardList: {
    response: 'Response',
    token: 'Token',
    cost: 'Cost',
    details: 'Details',
    abnormalStatus: 'Status Abnormal',
    na: 'N/A'
  },
  testAiRequest: {
    invokeRequest: 'Initiate Request',
    noData: 'No Data',
    requestKey: 'Request Key',
    systemPrompt: 'System Prompt',
    userPrompt: 'User Prompt',
    response: 'Response',
    error: 'Error',
    viewDetails: 'View Details',
    confirm: 'Confirm',
    cancel: 'Cancel',
    operation: 'Operation',
    rule: {
      id: 'ID cannot be empty'
    },
    message: {
      success: 'Operation successful',
      parameterMissing: 'Parameter missing',
      requestInitiated: 'Request initiated, please refresh later'
    }
  },
  aiCardListComp: {
    details: 'Details',
    leverage: 'Leverage',
    quantity: 'Quantity',
    time: 'Time',
    analysisEn: 'Analysis (EN)',
    analysisZh: 'Analysis (ZH)',
    takeProfit: 'Take Profit',
    stopLoss: 'Stop Loss',
    close: 'Close',
    executionResult: 'Execution Result',
    think: 'Think',
    userPrompt: 'User prompt',
    systemPrompt: 'System prompt'
  },
  historyPosition: {
    tradeDetails: 'Trade Details',
    realizedPnl: 'Realized P&L',
    closingQuantity: 'Closing Quantity',
    openingPrice: 'Open Avg Price',
    closingPrice: 'Close Avg Price',
    closingTime: 'Close Time',
    openingTime: 'Open Time',
    totalFee: 'Total Fee',
    pnl: 'P&L',
    pnlAfterFee: 'P&L (Before Fee)',
    openFee: 'Open Fee',
    closeFee: 'Close Fee',
    fundingFee: 'Funding Fee',
    feeDetails: 'Fee Details',
    loadingMore: 'Loading...',
    loadMoreHistory: 'Load More History',
    noMore: 'No More Data',
    noData: 'No More Data',
    fullMargin: 'Full',
    isolatedMargin: 'Isolated',
    long: 'Long',
    short: 'Short',
    openPriceLabel: 'Open:',
    closePriceLabel: 'Close:'
  }
};
