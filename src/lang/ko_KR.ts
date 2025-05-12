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
    任务管理: '작업 관리'
  },
  //通用
  common: {
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
  }
};
