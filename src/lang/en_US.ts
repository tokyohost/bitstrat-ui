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
    任务管理: 'Task Management'
  },
  //通用
  common: {
    direction: {
      long: 'Long',
      short: 'Short'
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
      "Any virtual currency exchange API Key used by the user on the Platform is created, authorized, and managed by the user. The permissions, risks, and independent control of the API Key are entirely borne by the user. The Platform will not save, disclose, or misuse the user's API Key, but the user must ensure that the API Key has a reasonable scope of permissions (such as trading-only permission, without withdrawal permission).",
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
  }
};
