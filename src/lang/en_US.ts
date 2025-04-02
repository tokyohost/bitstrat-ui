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
    login: 'Login',
    logging: 'Logging...',
    code: 'Verification Code',
    rememberPassword: 'Remember me',
    switchRegisterPage: 'Sign up now',
    rule: {
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
    password: 'Password',
    confirmPassword: 'Confirm Password',
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
    logout: 'Logout'
  },
  //menu 国际化
  menu: {
    首页: 'home',
    用户管理: 'Users',
    系统管理: 'System',
    租户管理: 'Tenant',
    系统监控: 'Monitor',
    系统工具: 'Tools',
    AI策略: 'AI',
    任务管理: 'Task'
  },
  //通用
  common: {
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
      start: 'Start'
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
        show: 'Task Detail'
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
  }
};
