export default {
  // 路由国际化
  route: {
    dashboard: '대시보드',
    document: '문서'
  },
  login: {
    selectPlaceholder: '회사 이름을 선택/입력하세요',
    username: '사용자 이름',
    password: '비밀번호',
    email: '이메일',
    login: '로그인',
    logging: '로그인 중...',
    code: '인증 코드',
    rememberPassword: '로그인 상태 유지',
    switchRegisterPage: '지금 가입하기',
    rule: {
      agreement: {
        required: '이용약관에 동의해 주세요.'
      },
      tenantId: {
        required: '테넌트 ID를 입력하세요'
      },
      username: {
        required: '계정을 입력하세요'
      },
      password: {
        required: '비밀번호를 입력하세요'
      },
      code: {
        required: '인증 코드를 입력하세요'
      }
    },
    social: {
      wechat: '위챗 로그인',
      maxkey: 'MaxKey 로그인',
      topiam: 'TopIam 로그인',
      gitee: 'Gitee 로그인',
      github: 'Github 로그인'
    }
  },
  // 注册页面国际化
  register: {
    selectPlaceholder: '회사 이름을 선택/입력하세요',
    username: '사용자 이름',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    invitationCode: '초대 코드',
    register: '등록',
    registering: '등록 중...',
    registerSuccess: '{username} 계정이 성공적으로 등록되었습니다!',
    code: '인증 코드',
    switchLoginPage: '기존 계정으로 로그인',
    rule: {
      tenantId: {
        required: '테넌트 ID를 입력하세요'
      },
      username: {
        required: '계정을 입력하세요',
        length: '사용자 계정의 길이는 {min}자 이상 {max}자 이하이어야 합니다'
      },
      password: {
        required: '비밀번호를 입력하세요',
        length: '비밀번호는 {min}자 이상 {max}자 이하이어야 합니다',
        pattern: '허용되지 않는 문자가 포함되어 있습니다: {strings}'
      },
      code: {
        required: '인증 코드를 입력하세요'
      },
      confirmPassword: {
        required: '비밀번호를 다시 입력하세요',
        equalToPassword: '두 비밀번호가 일치하지 않습니다'
      },
      invitationCode: {
        required: '초대 코드를 입력하세요'
      },
      email: {
        required: '이메일을 입력하세요',
        invalid: '유효한 이메일 주소를 입력하세요'
      }
    }
  },
  // 导航栏国际化
  navbar: {
    full: '전체 화면',
    language: '언어',
    dashboard: '대시보드',
    document: '문서',
    message: '메시지',
    layoutSize: '레이아웃 크기',
    selectTenant: '테넌트 선택',
    layoutSetting: '레이아웃 설정',
    personalCenter: '개인 센터',
    apiSetting: 'API 설정',
    socketStatus: '웹소켓 연결 상태',
    logout: '로그아웃',
    notifySetting: '알림 설정'
  },
  setting: {
    api: {
      未设置: '미설정',
      已设置: '설정됨'
    },
    apiSettingForm: {
      apiKey: 'API 키',
      secret: 'API 시크릿',
      passphrase: '비밀번호',
      title: '설정',
      succ: '설정이 완료되었습니다',
      checkFail: '검증 실패, API 설정이 올바른지 확인하세요'
    },
    socketStatus: {
      title: '알림',
      reconnectConfirm: '재연결이 시도됩니다. 계속하시겠습니까?',
      ok: '확인',
      cancel: '취소',
      done: '트리거됨!'
    }
  },
  //menu 国际化
  menu: {
    首页: '홈',
    用户管理: '사용자 관리',
    系统管理: '시스템 관리',
    资金费套利: '자금 비용 차익 거래',
    跨交易所套利: '교차 거래소 차익 거래',
    现货套利: '현물 차익 거래',
    跨交易所套利任务: '교차 거래소 차익 거래 작업',
    跨交易所套利警告: '교차 거래소 차익 거래 경고',
    跨交易所订单: '교차 거래소 주문',
    通知配置: '알림 설정',
    分批出入场: '배치 입출금',
    租户管理: '테넌트 관리',
    系统监控: '시스템 모니터링',
    系统工具: '시스템 도구',
    AI策略: 'AI 전략',
    任务管理: '작업 관리',
    'AI任务中心': 'AI 작업 센터',
    'AI智能分析': 'AI 지능형 분석',
    '策略广场': '전략 허브',
    'AI任务监控': '작업 모니터링'
  },
  //通用
  common: {
    direction: {
      long: '롱',
      short: '숏',
      tpsl: 'TP/SL',
      hold: '보유',
      close: '청산',
      nothing: '없음'
    },
    opt: {
      search: '검색',
      reset: '재설정',
      add: '추가',
      edit: '편집',
      delete: '삭제',
      export: '내보내기',
      show: '상세 보기',
      opt: '작업',
      stop: '중지',
      start: '시작',
      log: '로그',
      editRole: '역할 편집'
    },
    dialog: {
      confirm: '확인',
      cancel: '취소'
    }
  },
  bybit: {
    task: {
      status: {
        已创建: '생성됨',
        正在运行: '실행 중',
        已终止: '중지됨'
      },
      title: {
        add: '작업 생성',
        edit: '작업 편집',
        editRole: '역할 편집',
        show: '작업 상세',
        log: '작업 로그'
      },
      form: {
        id: 'ID',
        name: '작업 이름',
        symbol: '코인 이름',
        singleOrder: '주문 한도',
        balance: '포지션',
        coldSec: '쿨다운 시간',
        totalBalance: '사용 가능 신용',
        taskType: '유형'
      },
      table: {
        id: 'ID',
        name: '이름',
        symbol: '코인 이름',
        balance: '포지션',
        singleOrder: '주문 한도',
        coldSec: '쿨다운 시간',
        totalBalance: '사용 가능 신용',
        lastOrderTime: '마지막 주문 시간',
        taskType: '유형',
        createUserName: '생성자',
        status: '상태',
        avgPrice: '평균 포지션 가격',
        positionValue: '포지션 가치',
        markPrice: '시장 가격',
        unrealisedPnl: '미실현 손익'
      },
      placeholder: {
        id: '',
        name: '작업 이름을 입력하세요',
        symbol: '코인 이름을 선택하세요'
      },
      rule: {
        id: 'ID는 비워둘 수 없습니다',
        name: '작업 이름은 비워둘 수 없습니다',
        symbol: '심볼은 비워둘 수 없습니다'
      }
    }
  },
  home: {
    aiStrategy: {
      title: 'AI 전략',
      desc: '지능형 양적 거래 및 자동 거래 보조 도구'
    },
    aiSummary: {
      title: 'AI 분석',
      desc: '포지션 및 시장 동향 분석 보조 도구'
    },
    feed: {
      title: '전략 광장',
      desc: '더 많은 전략 발견'
    },
    more: {
      title: '더 많은 기능이 곧 나올 예정입니다',
      desc: '더 많은 흥미로운 콘텐츠를 준비 중입니다...'
    },
    totalAmount: {
      title: '총 자산 추이 통계'
    },
    dailyGrowthChart: {
      title: '일일 상승 하락 통계',
      item: '상승 비율'
    },
    predictedRateOfReturn: {
      title: '예상 수익률',
      item: '일 수익률'
    }
  },
  cryptoSlogan: {
    sloganSplit1: '귀하의 키는',
    sloganSplit2: 'PKCS1_OAEP',
    sloganSplit3: '기술을 사용하여 암호화 및 저장됩니다.'
  },
  'agreement': {
    'checkbox_text': '저는 다음 약관을 읽고 동의합니다:',
    'link_text': 'Bitstrat 플랫폼 사용자 면책 조항',
    'modal_title': 'Bitstrat 플랫폼 사용자 면책 조항',
    'last_updated': '최종 업데이트 날짜: 2025-12-4',
    'intro':
      '본 플랫폼(이하 “플랫폼”) 이용을 환영합니다. 플랫폼이 제공하는 AI 기술 서비스를 이용하기 전에 본 면책 조항을 주의 깊게 읽고 충분히 이해해야 합니다. 플랫폼을 계속 이용하거나 API Key를 제출하는 경우, 귀하는 다음 내용에 대해 인지하고 전적으로 동의함을 의미합니다:',
    'section_1_title': '1. 플랫폼의 성격',
    'section_1_content':
      '플랫폼은 AI 모델 호출 및 프롬프트 실행 기능, API Key 관리 도구, 전략 생성 및 자동 실행 인터페이스만 제공합니다. 플랫폼은 투자 조언, 재무 서비스 또는 자산 관리 업무를 제공하지 않으며, 고객을 대신하여 운영하지도 않습니다.',
    'section_2_title': '2. 사용자 API Key 권한',
    'section_2_content':
      '사용자가 플랫폼에서 사용하는 모든 가상화폐 거래소 API Key는 사용자가 직접 생성, 승인, 관리합니다. API Key의 권한, 위험, 자율적인 통제권은 전적으로 사용자가 부담합니다. 플랫폼은 사용자 API Key를 저장하거나 유출하거나 오용하지 않지만, 사용자는 API Key가 합리적인 권한 범위(예: 거래 전용 권한, 출금 권한 없음)를 가지고 있는지 직접 확인해야 합니다.',
    'section_3_title': '3. AI 행동 및 결과',
    'section_3_content':
      '사용자는 직접 프롬프트(Prompt)를 작성하며, 플랫폼의 AI 엔진이 프롬프트에 따라 거래 API 요청을 실행합니다. AI가 실행하는 모든 행동, 거래, 주문 체결, 취소, 포지션 조정 등의 작업은 사용자가 자발적으로 시작한 것으로 간주됩니다. 플랫폼은 AI의 이해 편차, 판단 오류, 통신 이상, 거래 실패, 지연으로 인한 손실에 대해 책임을 지지 않습니다.',
    'section_4_title': '4. 거래 위험 경고',
    'section_4_content':
      '디지털 자산 거래에는 가격의 급격한 변동, 시스템 이상, API 실패, 전략 무효화, 시장 위험 등 높은 위험이 수반됩니다. AI를 사용하여 자동 거래를 수행하는 경우, 모델 출력 편차, 전략 논리 오류, 프롬프트 모호성, 시스템 식별 오류를 포함하여 예측할 수 없는 추가적인 위험이 존재합니다. 위에 언급된 어떠한 이유로든 발생하는 계정 자산 손실, 수익 감소, 주문 오류, 포지션 강제 청산 등은 전적으로 사용자가 부담합니다.',
    'section_5_title': '5. 수수료 약관',
    'section_5_content':
      '플랫폼은 AI 토큰 사용량에 따라 수수료를 부과하며, 이는 사용자의 거래 결과와 무관합니다. 플랫폼은 수익 분배에 참여하지 않으며, 거래 수수료를 부과하지 않고, 성장 기반의 수익이 없습니다. 사용자가 충전하거나 수수료가 발생한 후에도 플랫폼은 AI의 결과나 성능에 대해 어떠한 수익도 보장하지 않습니다.',
    'section_6_title': '6. 준수 및 사용 제한',
    'section_6_content':
      '사용자는 플랫폼을 이용하여 돈세탁, 현금 유용, 다크넷 거래 등을 포함한 어떠한 불법 활동도 수행할 수 없습니다. 사용자는 본 플랫폼 사용과 관련된 거래소 API, 전략, 행위가 현지 법률 및 규정을 준수하는지 확인해야 합니다. 법률 또는 규제 요구 사항을 위반하는 계정 운영은 전적으로 사용자가 책임을 부담합니다.',
    'section_7_title': '7. 면책 조항',
    'section_7_list_1': 'AI 모델 출력으로 인해 발생하는 모든 직간접적 손실',
    'section_7_list_2': '사용자의 잘못된 API Key 설정 또는 과도한 승인으로 인한 위험',
    'section_7_list_3': '네트워크, 거래소, 서버, 제3자 API 등으로 인해 발생하는 시스템 오류',
    'section_7_list_4': '사용자 자체 전략 또는 프롬프트 논리로 인해 발생하는 손실',
    'section_7_list_5': '불가항력으로 인해 발생하는 거래 실패 또는 데이터 손실',
    'section_8_title': '8. 사용자 약속',
    'section_8_content':
      '사용자는 자신의 거래에 대한 전적인 책임 부담, AI 모델의 출력 결과에 대한 독립적인 판단, 플랫폼 서비스를 투자 조언으로 간주하지 않음, API Key의 합법성 및 보안 보장, 모든 플랫폼 수수료 정책 및 호출 과금 규칙에 동의할 것을 약속합니다.',
    'section_9_title': '9. 최종 해석 권한',
    'section_9_content': '본 플랫폼은 본 면책 조항에 대한 최종 해석 권한 및 언제든지 수정할 권한을 보유합니다.',
    'confirm_button': '인지하였습니다',
    'required_error': '사용자 약관을 읽고 동의하십시오'
  },
  accountSelect: {
    form: {
      apiKey: 'API 키',
      name: '이름',
      exchange: '거래소'
    },
    placeholder: {
      apiKey: 'API 키를 입력하세요',
      name: 'API 이름을 입력하세요',
      exchange: '거래소를 선택하세요'
    },
    table: {
      exchange: '거래소',
      name: '이름',
      apiKey: 'API 키',
      balance: '총 잔액',
      freeBalance: '사용 가능한 잔액',
      type: '유형',
      createTime: '생성 시간'
    },
    action: {
      syncBalance: '잔액 업데이트',
      select: '선택',
      save: '저장'
    }
  },
  accountSelectDialog: {
    title: 'API 설정',
    action: {
      close: '닫기'
    }
  },
  positionWidget: {
    full: '전체',
    positionSize: '포지션 크기',
    avgPrice: '평균 진입 가격',
    unrealizedProfit: '미실현 손익',
    realizedProfit: '실현 손익',
    margin: '마진',
    marginRatio: '유지 보증금 비율',
    liqPrice: '청산 예상 가격',
    syncTime: '동기화 시간',
    updateTime: '포지션 업데이트 시간',
    tpslOrder: 'TP/SL 주문',
    leverage: '레버리지',
    marginType: '마진 유형'
  },
  feedPage: {
    title: '전략 광장 Beta',
    subtitle: '최고의 전략을 공유하세요',
    profit3m: '3개월 수익',
    likes: '좋아요',
    viewDetails: '보기',
    loadingMore: '더 많은 데이터 로드 중...',
    noMore: '더 이상 데이터 없음',
    loadNext: '다음 페이지 로드',
    comingSoon: '곧 출시될 예정입니다'
  },
  sharePanel: {
    title: '전략 광장에 전략 공유',
    strategyTitle: '전략 제목',
    strategyTitlePlaceholder: '눈에 띄는 이름을 지어주세요',
    introduction: '소개',
    introductionPlaceholder: '전략 내용을 소개해주세요',
    strategyTags: '전략 태그',
    selectTags: '태그 선택',
    tagLimit: '최대 3개 태그',
    notice: '전략 광장에 공유해도 Prompt나 구성이 공개되지 않으며, API 손익 곡선만 표시됩니다',
    cancel: '취소',
    cancelShare: '공유 취소',
    updateShare: '공유 업데이트',
    share: '공유',
    rule: {
      title: '제목은 비워둘 수 없습니다',
      titleLength: '제목은 4~12자여야 합니다',
      content: '소개는 비워둘 수 없습니다',
      contentLength: '소개는 4~200자여야 합니다',
      tags: '최소 1개의 태그를 선택하세요'
    }
  },
  taskItem: {
    view: '보기',
    edit: '편집',
    stop: '중지',
    start: '시작',
    delete: '삭제',
    coins: '코인',
    startBalance: '시작 잔액',
    timeGranularity: '시간 단위',
    createTime: '생성 시간',
    shared: '공유됨',
    status: {
      已创建: '생성됨',
      正在运行: '실행 중',
      已终止: '중지됨'
    }
  },
  aiTask: {
    taskName: '작업 이름',
    taskNamePlaceholder: '작업 이름을 입력하세요',
    search: '검색',
    reset: '재설정',
    createTask: '작업 생성',
    modifyTask: '작업 수정',
    exchange: '거래소',
    selectExchange: '거래소를 선택하세요',
    coins: '코인',
    coinsPopoverTitle: '코인',
    coinsPopoverContent: 'AI 거래를 허용하는 코인',
    selectCoins: '코인을 선택하세요',
    initialBalance: '초기 잔액',
    initialBalancePopoverTitle: '초기 금액',
    initialBalancePopoverContent:
      'AI에게 거래 시작 시의 비용선을 기억하도록 함 (계정/서브계정 잔액을 입력하면, 전체 계정의 USDT 잔액을 가져올 때 입력하세요)',
    aiAgent: 'AI 에이전트',
    selectAiAgent: 'AI 에이전트를 선택하세요',
    timeGranularity: '시간 단위',
    timeGranularityPopoverTitle: '시간 단위',
    timeGranularityPopoverContent:
      '시스템이 얼마나 자주 AI에 시장 데이터를 제공하고 AI의 거래 결정을 기다릴 것인지 (너무 짧지 않도록 선택, AI의 사고 시간 고려)',
    leverage: '레버리지 범위',
    shortTermIndicator: '단기 지표',
    shortTermIndicatorPopoverTitle: '단기 지표',
    shortTermIndicatorPopoverContent: 'AI를 호출할 때 EMA/MACD/RSI 등 단기 지표의 데이터 소스로 K선 데이터를 가져옴',
    longTermIndicator: '장기 지표',
    longTermIndicatorPopoverTitle: '장기 지표',
    longTermIndicatorPopoverContent:
      'AI를 호출할 때 EMA/MACD/RSI 등 장기 지표의 데이터 소스로 K선 데이터를 가져옴. 주의: 장기 지표는 단기 지표보다 길어야 합니다!!',
    basicConfig: '기본 설정',
    accountSelect: '계정 선택',
    selectAccount: '계정 선택',
    systemPrompt: '시스템 프롬프트',
    systemPromptPlaceholder:
      '시스템 프롬프트를 입력하면, AI가 실행할 규칙, 거래 논리, 거래 규율 등을 요구할 수 있습니다. 모두 당신의 선택입니다. 당신의 완벽한 전략을 기대합니다',
    preset1: '사전 설정된 프롬프트 1',
    preset2: '사전 설정된 프롬프트 2',
    userPrompt: '사용자 프롬프트',
    userPromptPlaceholder: '거래 아이디어를 입력하면, 각 API 호출 시 사용자 프롬프트의 맨 앞에 추가됩니다',
    exampleContent:
      '다음 예제 내용은 AI에 제공되는 시장 데이터, 현재 포지션 데이터, 과거 성적 등입니다. 현재는 수정할 수 없으며, 당신의 거래 아이디어는 예제 내용 앞에 결합됩니다:',
    nextStep: '다음',
    confirm: '확인',
    cancel: '취소',
    minutes: '분',
    usdt: 'USDT',
    rule: {
      taskName: '작업 이름은 비워둘 수 없습니다',
      exchange: '거래소는 비워둘 수 없습니다',
      symbols: '최소 하나의 코인을 선택해야 합니다',
      aiAgent: 'AI 에이전트를 선택하세요',
      timeGranularity: '시간 단위를 선택하세요',
      apiId: 'API 계정을 선택하세요',
      systemPrompt: '시스템 프롬프트는 비워둘 수 없습니다',
      leverage: '레버리지 범위를 선택해야 합니다',
      longTermInterval: '장기 주기는 단기 주기보다 커야 합니다',
      shortTermInterval: '단기 주기는 장기 주기보다 작아야 합니다',
      initialBalance: '초기 잔액을 입력해야 합니다',
      initialBalanceLessThan10: '초기 잔액은 10 미만일 수 없습니다'
    },
    message: {
      success: '작업이 성공했습니다',
      deleteConfirm: 'ID가 "{id}"인 AI 작업을 삭제하시겠습니까?',
      deleteSuccess: '삭제 성공',
      selectExchangeFirst: '먼저 거래소를 선택하세요'
    }
  },
  aiCardList: {
    response: '응답',
    token: '토큰',
    cost: '비용',
    details: '상세',
    abnormalStatus: '상태 이상',
    na: '해당 없음'
  },
  testAiRequest: {
    invokeRequest: '요청 시작',
    noData: '데이터 없음',
    requestKey: '요청 키',
    systemPrompt: '시스템 프롬프트',
    userPrompt: '사용자 프롬프트',
    response: '응답',
    error: '오류',
    viewDetails: '상세 보기',
    confirm: '확인',
    cancel: '취소',
    operation: '작업',
    rule: {
      id: 'ID는 비워둘 수 없습니다'
    },
    message: {
      success: '작업이 성공했습니다',
      parameterMissing: '매개변수 누락',
      requestInitiated: '요청이 시작되었습니다. 나중에 새로고침하세요'
    }
  },
  aiCardListComp: {
    details: '상세',
    leverage: '레버리지',
    quantity: '수량',
    time: '시간',
    analysisEn: '분석 (EN)',
    analysisZh: '분석 (ZH)',
    takeProfit: '익절',
    stopLoss: '손절',
    close: '닫기',
    executionResult: '실행 결과',
    think: 'Think',
    userPrompt: 'User prompt',
    systemPrompt: 'System prompt'
  },
  historyPosition: {
    tradeDetails: '거래 상세',
    realizedPnl: '실현 손익',
    closingQuantity: '청산 수량',
    openingPrice: '평균 개시가',
    closingPrice: '평균 청산가',
    closingTime: '청산',
    openingTime: '개시',
    totalFee: '총 수수료',
    pnl: 'P&L',
    pnlAfterFee: 'P&L (수수료 제외)',
    openFee: '개시 수수료',
    closeFee: '청산 수수료',
    fundingFee: '자금 조달료',
    feeDetails: '수수료 상세',
    loadingMore: '로드 중...',
    loadMoreHistory: '더 많은 거래 기록 로드',
    noMore: '더 이상 데이터 없음',
    noData: '더 이상 데이터 없음',
    fullMargin: '전체',
    isolatedMargin: '격리',
    long: '롱',
    short: '숏',
    openPriceLabel: '개:',
    closePriceLabel: '청:'
  },
  aiLogs: {
    accountFundsTrend: '계정 자금 추이',
    accountAvailableTrend: '계정 가용 잔액 추이',
    realtimePosition: '실시간 포지션',
    query: '조회',
    selectDateRange: '유효한 날짜 범위를 선택하여 조회하세요.',
    startDate: '시작 날짜',
    endDate: '종료 날짜',
    rangeSeparator: '~',
    lastWeek: '지난 주',
    lastMonth: '지난 달',
    lastThreeMonths: '지난 3개월',
    requestLog: '요청 로그',
    operationLog: '작업 로그',
    historyPosition: '거래 이력',
    usdt: 'USDT',
    anomalyWarning: '매개변수 오류!'
  }
};
