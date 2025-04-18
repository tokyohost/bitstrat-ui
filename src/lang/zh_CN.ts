export default {
  // 路由国际化
  route: {
    dashboard: '首页',
    document: '项目文档'
  },
  // 登录页面国际化
  login: {
    selectPlaceholder: '请选择/输入公司名称',
    username: '用户名',
    email: '邮箱',
    password: '密码',
    login: '登 录',
    logging: '登 录 中...',
    code: '验证码',
    rememberPassword: '记住我',
    switchRegisterPage: '立即注册',
    rule: {
      tenantId: {
        required: '请输入您的租户编号'
      },
      username: {
        required: '请输入您的账号'
      },
      password: {
        required: '请输入您的密码'
      },
      code: {
        required: '请输入验证码'
      }
    },
    social: {
      wechat: '微信登录',
      maxkey: 'MaxKey登录',
      topiam: 'TopIam登录',
      gitee: 'Gitee登录',
      github: 'Github登录'
    }
  },
  // 注册页面国际化
  register: {
    selectPlaceholder: '请选择/输入公司名称',
    username: '用户名',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    invitationCode: '邀请码',
    register: '注 册',
    registering: '注 册 中...',
    registerSuccess: '恭喜你，您的账号 {username} 注册成功！',
    code: '验证码',
    switchLoginPage: '使用已有账户登录',
    rule: {
      tenantId: {
        required: '请输入您的租户编号'
      },
      username: {
        required: '请输入您的账号',
        length: '用户账号长度必须介于 {min} 和 {max} 之间'
      },
      password: {
        required: '请输入您的密码',
        length: '用户密码长度必须介于 {min} 和 {max} 之间',
        pattern: '不能包含非法字符：{strings}'
      },
      code: {
        required: '请输入验证码'
      },
      confirmPassword: {
        required: '请再次输入您的密码',
        equalToPassword: '两次输入的密码不一致'
      },
      invitationCode: {
        required: '请输入邀请码'
      },
      email: {
        required: '请输入邮箱',
        invalid: '请输入正确的邮箱'
      }
    }
  },
  // 导航栏国际化
  navbar: {
    full: '全屏',
    language: '语言',
    dashboard: '首页',
    document: '项目文档',
    message: '消息',
    layoutSize: '布局大小',
    selectTenant: '选择租户',
    layoutSetting: '布局设置',
    personalCenter: '个人中心',
    apiSetting: 'API设置',
    logout: '退出登录'
  },
  setting: {
    api: {
      未设置: '未设置',
      已配置: '已配置'
    },
    apiSettingForm: {
      apiKey: 'ApiKey',
      secret: 'ApiSecuret',
      passphrase: '密码',
      title: '设置',
      succ: '配置成功',
      checkFail: '校验失败,请检查API配置是否正确'
    }
  },
  //menu 国际化
  menu: {
    首页: '首页'
  },
  //通用
  common: {
    opt: {
      search: '查询',
      reset: '重置',
      add: '新增',
      edit: '修改',
      delete: '删除',
      export: '导出',
      show: '查看',
      opt: '操作',
      stop: '停止',
      start: '启动',
      log: '日志',
      editRole: '修改'
    },
    dialog: {
      confirm: '确 定',
      cancel: '取 消'
    }
  },
  bybit: {
    task: {
      status: {
        已创建: '已创建',
        正在运行: '正在运行',
        已终止: '已终止'
      },
      title: {
        add: '创建任务',
        edit: '修改任务',
        editRole: '修改策略',
        show: '任务详情',
        log: '任务日志'
      },
      form: {
        id: 'id',
        name: '任务名称',
        symbol: '币种'
      },
      table: {
        id: 'id',
        name: '任务名称',
        symbol: '币种',
        balance: '持仓',
        singleOrder: '下单限制',
        coldSec: '冷却时间',
        totalBalance: '可用额度',
        lastOrderTime: '最近下单时间',
        taskType: '策略类型',
        createUserName: '创建人',
        status: '任务状态',
        avgPrice: '平均持仓价格',
        positionValue: '仓位价值',
        markPrice: '市场价',
        unrealisedPnl: '盈亏'
      },
      placeholder: {
        id: '',
        name: '请输入任务名称',
        symbol: '请选择币种'
      },
      rule: {
        id: 'id 不能为空',
        name: '任务名称不能为空',
        symbol: '币种不能为空'
      }
    }
  }
};
