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
      agreement: {
        required: '请阅读并同意用户协议'
      },
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
    socketStatus: 'websocket 连接状态',
    logout: '退出登录',
    notifySetting: '通知配置'
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
    },
    socketStatus: {
      title: '提示',
      reconnectConfirm: '将触发重连，是否继续?',
      ok: '确定',
      cancel: '取消',
      done: '已触发'
    }
  },
  //menu 国际化
  menu: {
    首页: '首页',
    用户管理: '用户管理',
    系统管理: '系统管理',
    资金费套利: '资金费套利',
    跨交易所套利: '跨交易所套利',
    现货套利: '现货套利',
    跨交易所套利任务: '跨交易所套利任务',
    跨交易所套利警告: '跨交易所套利警告',
    跨交易所订单: '跨交易所订单',
    通知配置: '通知配置',
    分批出入场: '分批出入场',
    租户管理: '租户管理',
    系统监控: '系统监控',
    系统工具: '系统工具',
    AI策略: 'AI策略',
    任务管理: '任务管理',
    AI任务中心: 'AI任务中心',
    AI智能分析: 'AI智能分析',
    策略广场: '策略广场'
  },
  //通用
  common: {
    direction: {
      long: '做多',
      short: '做空'
    },
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
  },
  //首页
  home: {
    aiStrategy: {
      title: 'AI 策略',
      desc: '智能量化与自动交易辅助工具'
    },
    aiSummary: {
      title: 'AI 智能分析',
      desc: '智能分析仓位以及行情辅助工具'
    },
    feed: {
      title: '策略广场',
      desc: '发现更多策略'
    },
    more: {
      title: '更多功能敬请期待',
      desc: '我们正在为你准备更多精彩内容...'
    },
    totalAmount: {
      title: '总资产趋势统计'
    },
    dailyGrowthChart: {
      title: '每日涨跌统计',
      item: '涨幅百分比'
    },
    predictedRateOfReturn: {
      title: '预测收益率',
      item: '天回测年化收益率'
    }
  },
  //跨所套利
  abEx: {},
  cryptoSlogan: {
    sloganSplit1: '您的密钥将使用',
    sloganSplit2: 'PKCS1_OAEP',
    sloganSplit3: '技术进行加密和存储。'
  },
  agreement: {
    'checkbox_text': '我已阅读并同意',
    'link_text': '《Bitstrat 平台用户免责声明》',
    'modal_title': 'Bitstrat 平台用户免责声明',
    'last_updated': '最后更新日期：2025-12-4',
    'intro':
      '欢迎使用本平台（以下简称“平台”）。在使用平台提供的 AI 技术服务前，请您务必仔细阅读并充分理解本免责声明。若您继续使用平台或提交 API Key，即表示您已知悉并完全同意以下内容：',
    'section_1_title': '平台性质说明',
    'section_1_content':
      '平台仅提供：AI 模型调用与提示词执行能力、API Key 管理工具、策略生成与自动执行接口。平台 不提供投资建议、理财服务或资产管理业务，也不进行代客操作。',
    'section_2_title': '用户 API Key 权限',
    'section_2_content':
      '用户在平台中使用的任何虚拟币交易所 API Key 均由用户自行创建、授权、管理。API Key 的权限、风险、自主控制权完全由用户自行承担。平台不会保存、泄露或滥用用户 API Key，但用户需自行确保 API Key 拥有合理的权限范围（如仅交易权限，无提币权限）。',
    'section_3_title': 'AI 行为及结果说明',
    'section_3_content':
      '用户自行编写提示词（Prompt），并由平台的 AI 引擎按提示词执行交易 API 请求。AI 执行的任何行为、交易、订单下达、撤单、调整仓位等操作 均视为用户主动发起。平台不对 AI 的理解偏差、判断错误、通讯异常、交易失败、延迟造成的损失承担责任。',
    'section_4_title': '交易风险提示',
    'section_4_content':
      '数字资产交易具有高度风险，包括但不限于：价格剧烈波动、系统异常、API 失败、策略失效、市场风险等。使用 AI 进行自动交易存在额外不可预测风险，包括：模型输出偏差、策略逻辑错误、提示词歧义、系统识别错误。因上述任何原因导致的账户资产损失、收益减少、订单错误、仓位爆仓等，均由用户自行承担。',
    'section_5_title': '收费条款',
    'section_5_content':
      '平台根据 AI Token 使用量 收取费用，与用户的交易结果无关。平台 不参与分成、不收取交易费用、无成长性收益。用户充值或产生费用后，平台不对 AI 的结果或表现做任何收益保证。',
    'section_6_title': '合规与使用限制',
    'section_6_content':
      '用户不得利用平台进行任何违法活动，包括但不限于洗钱、套现、暗网交易等。用户应确保使用本平台所涉及的交易所 API、策略、行为符合当地法律法规。违反法律或监管要求的账户操作由用户自行承担责任。',
    'section_7_title': '免责条款',
    'section_7_list_1': '因 AI 模型输出导致的任何直接或间接损失',
    'section_7_list_2': '因用户错误配置 API Key 或过度授权造成的风险',
    'section_7_list_3': '因网络、交易所、服务器、第三方 API 等导致的系统故障',
    'section_7_list_4': '因用户自身策略、提示词逻辑造成的损失',
    'section_7_list_5': '因不可抗力导致的交易失败或数据丢失',
    'section_8_title': '用户承诺',
    'section_8_content':
      '用户承诺：对自己的交易承担全部责任、对 AI 模型的输出结果进行独立判断、不将平台服务视为投资建议、保证 API Key 的合法性、安全性、同意平台所有费用策略与调用计费规则。',
    'section_9_title': '最终解释权',
    'section_9_content': '本平台保留对本免责声明的最终解释权及随时修改权。',
    'confirm_button': '我已知悉',
    'required_error': '请阅读并同意用户协议'
  },
  accountSelect: {
    form: {
      apiKey: 'APIKey',
      name: '名称',
      exchange: '交易所'
    },
    placeholder: {
      apiKey: '请输入API KEY',
      name: '请输入API名称',
      exchange: '请选择交易所'
    },
    table: {
      exchange: '交易所',
      name: '名称',
      apiKey: 'API Key',
      balance: '总余额',
      freeBalance: '可用余额',
      type: '类型',
      createTime: '创建时间'
    },
    action: {
      syncBalance: '更新余额',
      select: '选择',
      save: '保存'
    }
  },
  accountSelectDialog: {
    title: '配置API',
    action: {
      close: '关闭'
    }
  },
  positionWidget: {
    full: '全仓',
    positionSize: '持仓数量',
    avgPrice: '平均入场价格',
    unrealizedProfit: '未实现盈亏',
    realizedProfit: '已实现盈亏',
    margin: '保证金',
    marginRatio: '保证金率',
    liqPrice: '预估强平价',
    syncTime: '同步时间',
    updateTime: '仓位变更时间',
    tpslOrder: 'TPSL订单',
    leverage: '杠杆',
    marginType: '保证金类型'
  },
  feedPage: {
    title: '策略广场 Beta',
    subtitle: '分享您的顶尖策略',
    profit3m: '3个月收益',
    likes: '赞',
    viewDetails: '查看',
    loadingMore: '加载更多数据...',
    noMore: '没有更多啦',
    loadNext: '加载下一页',
    comingSoon: '敬请期待'
  },
  sharePanel: {
    title: '分享策略到策略广场',
    strategyTitle: '策略标题',
    strategyTitlePlaceholder: '取一个显眼的名字吧',
    introduction: '简介',
    introductionPlaceholder: '介绍一下您的策略内容吧',
    strategyTags: '策略标签',
    selectTags: '请选择标签',
    tagLimit: '最多选择3个标签',
    notice: '分享至策略广场不会公开您的提示词或者任何配置,仅仅展示您API 的盈亏曲线',
    cancel: '取消',
    cancelShare: '取消分享',
    updateShare: '更新分享',
    share: '分享',
    rule: {
      title: '标题不能为空',
      titleLength: '标题长度 4~12 字符',
      content: '简介不能为空',
      contentLength: '简介长度 4~200 字符',
      tags: '至少选择一个标签'
    }
  },
  taskItem: {
    view: '查看',
    edit: '修改',
    stop: '终止',
    start: '启动',
    delete: '删除',
    coins: '币种',
    startBalance: '开始资金',
    timeGranularity: '时间粒度',
    createTime: '创建时间',
    shared: '已分享',
    status: {
      已创建: '已创建',
      正在运行: '正在运行',
      已终止: '已终止'
    }
  },
  aiTask: {
    taskName: '任务名称',
    taskNamePlaceholder: '请输入任务名称',
    search: '搜索',
    reset: '重置',
    createTask: '创建任务',
    modifyTask: '修改任务',
    exchange: '交易所',
    selectExchange: '请选择交易所',
    coins: '币种',
    coinsPopoverTitle: '币种',
    coinsPopoverContent: '允许AI交易的币种',
    selectCoins: '请选择币种',
    initialBalance: '初始资金',
    initialBalancePopoverTitle: '初始金额',
    initialBalancePopoverContent: '让AI记住他开始交易时的成本线(尽量填写账户/子账户余额,获取余额时获取整个账户的USDT余额)',
    aiAgent: 'AI智能体',
    selectAiAgent: '请选择AI智能体',
    timeGranularity: '时间粒度',
    timeGranularityPopoverTitle: '时间粒度',
    timeGranularityPopoverContent: '系统每隔多久将行情数据提供给AI并等待AI做出交易决策（选择时不易过短，需要将ai思考时间考虑在内）',
    leverage: '杠杆范围',
    shortTermIndicator: '短期指标',
    shortTermIndicatorPopoverTitle: '短期指标',
    shortTermIndicatorPopoverContent: '每次调用AI时获取多长时间的K线数据作为短期指标EMA/MACD/RSI 等的数据源',
    longTermIndicator: '长期指标',
    longTermIndicatorPopoverTitle: '长期指标',
    longTermIndicatorPopoverContent: '每次调用AI时获取多长时间的K线数据作为长期指标EMA/MACD/RSI 等的数据源,注意!!长期指标必须比短期指标更长时!!',
    basicConfig: '基本配置',
    accountSelect: '账号选择',
    selectAccount: '选择账户',
    systemPrompt: '系统提示词',
    systemPromptPlaceholder: '请输入系统提示词,您可以在此要求AI执行的规则、交易逻辑、交易纪律等等,一切取决于您，期待您的完美策略',
    preset1: '预设提示词1',
    preset2: '预设提示词2',
    userPrompt: '用户提示词',
    userPromptPlaceholder: '请输入您的交易想法，将添加到每次调用API时用户提示词最前',
    exampleContent: '以下示例内容作为提供给AI的行情数据、当前仓位数据、历史成绩等数据，暂不支持修改，您的交易想法将拼接在示例内容之前:',
    nextStep: '下一步',
    confirm: '确 定',
    cancel: '取 消',
    minutes: '分钟',
    usdt: 'USDT',
    rule: {
      taskName: '任务名称不能为空',
      exchange: '交易所不能为空',
      symbols: '操作币种至少选择一个',
      aiAgent: '请选择AI 智能体',
      timeGranularity: '请选择时间粒度',
      apiId: '请选择API账号',
      systemPrompt: '系统提示词不允许为空',
      leverage: '杠杆范围必须选择',
      longTermInterval: '长期周期必须大于短周期',
      shortTermInterval: '短周期必须小于长期周期',
      initialBalance: '初始资金必须填写',
      initialBalanceLessThan10: '初始资金不能小于 10'
    },
    message: {
      success: '操作成功',
      deleteConfirm: '是否确认删除AI任务编号为"{id}"的数据项？',
      deleteSuccess: '删除成功',
      selectExchangeFirst: '请先选择交易所'
    }
  },
  aiCardList: {
    response: '响应',
    token: 'Token',
    cost: '成本',
    details: '详情',
    abnormalStatus: '状态异常',
    na: 'N/A'
  },
  testAiRequest: {
    invokeRequest: '立即发起请求',
    noData: '暂无数据',
    requestKey: '请求key',
    systemPrompt: '系统提示词',
    userPrompt: '用户提示词',
    response: '响应',
    error: '异常',
    viewDetails: '查看详情',
    confirm: '确 定',
    cancel: '取 消',
    operation: '操作',
    rule: {
      id: 'id不能为空'
    },
    message: {
      success: '操作成功',
      parameterMissing: '参数缺失',
      requestInitiated: '请求已发起请稍后刷新'
    }
  }
};
