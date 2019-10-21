# About ChatCor project

This repository provides ChatBot Corpus authoring environments based on lexical analysis. This project is especially good for agglutinative languages.

(translated by Google Translation. It will be reviewed by Jesse Jeong, Project director)

The abstract concept of artificial intelligence has gone through many bends. It has been used a lot as the subject of film, and it is also covered in the humanities such as what kind of artificial intelligence will produce, self, etc. in the future. At first, it has been said that AI will solve all of human beings, but the recent AI approach has been broken down into more areas, focusing on how to solve problems in each industry. This aspect is quite encouraging in terms of technology development.

What makes humans the most human is the legal system that supports them, along with a highly knowledgeable system of language and letters. So the starting point of AI also started with language. Today, we are educating the most basic information such as how to recognize objects, how to stand and walk, which are the most basic interface for human beings, but in the future, we will dig into the logical area, the area of ​​knowledge. . Currently, technology is advanced in the form of Knowledge Graph, but as people's thoughts become logical, they will continue to hover (chicken first or egg first). is.

Instead, what I'm focusing on is how to construct a chatbot in terms of deadlock, refractive and isolation. And what is the problem with configuring a chatbot in an enterprise environment, and what is the problem with the projects that have been done so far? In conclusion, most customers know the answer. Nobody knows banking as well as banking. The administrative process makes the final decision and decides everything. In other words, the customer is ready to answer.


# 한국어 소개문

## 프로젝트의 추친 취지 및 용도

인공지능이라는 추상적인 개념은 지금까지 많은 굴곡을 넘어 왔습니다. 영화의 주제로도 많이 사용되어 왔으며, 앞으로 인공지능이 어떤 결과를 만들어낼 것인지, 자아를 갖게 될 것인지 등등 인문학적 주제에서도 많이 다루어지고 있습니다. 처음에는 인공지능이 인간의 모든 것을 해결해줄 것 처럼 이야기 되어 왔으나 최근의 인공지능 접근법은 보다 분야별로 세분화되어서 각 산업분야의 문제를 어떻게 해결할 것인지에 초점지워지고 있습니다. 이러한 측면은 기술발전 관점에서 꽤나 고무적인 것이라 할 수 있습니다.

인간을 가장 인간답게 만들어주는 것은 언어와 문자라고 하는 고도의 지식 전달체계와 함께 이를 지탱하는 법제도에 있다고 봅니다. 그래서 인공지능의 출발점도 언어에서 시작했습니다. 오늘날에는 인간에게 가장 기본되는 인터페이스인 물건을 알아보는 방법, 일어서고 걷는 방법 등 가장 기초가 되는 정보들을 교육시켜주고 있으나, 앞으로는 논리적인 영역, 즉 지식(knowledge)에 대한 영역까지 파고들게 될 것입니다. 현재 지식그래프(Knowledge Graph) 형태로 기술이 진보되고는 있으나, 사람의 생각도 논리적으로 하다 보면 계속 맴돌게 되듯(닭이 먼저인가 알이 먼저인가), 이 부분의 연구는 앞으로도 많이 진행되어야 할 것입니다.

대신 제가 집중하게 된 부분은 교착어, 굴절어, 고립어 관점에서 챗봇을 어떻게 구성하느냐 하는 것입니다. 그리고 엔터프라이즈 환경에서 챗봇을 구성할 때 무엇이 문제인지, 지금까지 수행되어온 프로젝트에서 문제점은 무엇인지 하고 말이지요. 결론적으로 본다면 고객들은 대부분 답을 알고 있습니다. 은행 업무에 대해서 은행만큼 잘 아는 곳은 없지요. 행정 절차에 대해서는 행정기관이 최종 결정을 내리며 모든 것을 결정합니다. 즉, 고객은 대답할 준비가 되어 있습니다.

그렇다면 사용자는 어떨까요? 사용자의 질문은 천차만별입니다. 그 용어도 다양하고요. 영어를 비롯한 굴절어는 이러한 부분에 있어서 경우의 수가 줄어들기 때문에 챗봇 구성이 상대적으로 용이합니다. 키릴문자와 같이 성과 여러 상황에 따라서 단어가 바뀌는 경우도 있으나 규칙화가 가능합니다. 그러나 한국어의 경우에는 특정 문법요소가 빠져도 별 문제가 없습니다. 다음의 문장들을 볼까요?

* 서울에서 부산까지 빠른 길이 어디지?
* 서울-부산 빠른 길 알려줘
* 서울에서 부산 빠른 길 없니?
* 서울-부산까지 어떻게 가면 가장 빨리 가니?
* 서울 부산 빠른길
* 서울 부산 제일 빠른 길
* ....


여기에 나열된 문장은 모두 다 같은 의미입니다. 챗봇에서 사용자의 질의를 분석하기 위해 이러한 형태는 다음과 같이 정규화 될 수 있습니다. 표시는 제 마음대로 했습니다.

> <출발지> @@@ <목적지> @@@ <빠른 길> @@@

인텐트의 핵심 "빠른 길"이고 이를 위해서는 두 개의 필수적 인자 "출발지"와 "목적지"가 필요합니다. 이 인텐트는 챗봇 엔진들에서 정의를 하면 큰 문제가 없습니다만, 그 뒤에 나오는 각종 표현들은 챗봇 엔지니어들의 머리를 병들게 합니다. 어떻게 하면 저토록 다양한 문장에서 의미들을 뽑아내어볼까요? 이 때 생각하게 된 것이 적절한 문구 라이브러리를 넣어서 기본 프레임을 만들고 여기에 반복적으로 문장을 생성하는 것입니다. 하나의 인텐트에 사용자 입력 문구가 많아질 수록 기계학습이 수월해지는 것처럼 이러한 문장을 자동으로 생성토록 하는 프로젝트를 만들면 좋겠다고 생각했습니다.

이에 지금까지 준비되고 개발되어온 프로젝트를 외부에 조용히 꺼내게 되었습니다. 바로 "ChatCor" 프로젝트입니다. 정확하게 이야기 하자면 Chatbot Corpus의 약자이기도 합니다만, Cor는 불어나 고려시대때 서양에서 한국을 부르던 명칭, Coree, Corea의 앞 세 글자를 차용한 것이기도 합니다. 순수 한국어로 프로젝트 이름을 만들고자 생각도 했는데, 외국과 소통하기 위해서는 영어 기반으로 만드는 것도 좋겠다고 판단했습니다.

본 프로젝트는 큰 관점에서 개발 관점의 이슈를 집중 관리하는 프로젝트입니다. 데이터 관련해서는 ChatCorDataLab에 접속해주세요.

## 프로젝트를 시작하는 방법

본 프로젝트를 시작하기 위해서는 개방형OS가 설치되어있어야 하며, 자체적으로 확보한 형태소 분석기가 있어야 합니다. 형태소 분석기는 공개SW로 된 버전이 될 수도 있으며 상용버전, 혹은 직접 개발한 것일 수도 있습니다. 형태소 분석기와 편집기의 인터페이스 사이에는 변환 관련 별도의 코딩을 해야 합니다.

## 프로젝트에 참여하는 방법

본 프로젝트의 커미터가 되어주세요. 향후 다양한 챗봇 개발 관련 기술지원 이슈를 제공받게 됩니다.

아울러 여러가지 샘플 데이터를 통하여 챗봇의 성능을 향상시키는 방법을 배울 수 있습니다.

## 라이선스

본 프로젝트는 Apache 2.0 라이선스를 준용합니다.

## 기타 리소스들

본 프로젝트에 활용된 프레임워크는 BootStrap을 기반으로 사용자 인터페이스를 구성하였습니다.

## 알림사항

본 프로젝트는 정보통신산업진흥원 "2019년도 개방형OS 환경개발 및 보급·확산 사업"의 지원에 의하여 추진되고 있으며, 5년 이상의 프로젝트 수행을 보장합니다. 프로젝트의 기획이 향후 챗봇 개발자들의 도움이 될 것이라 판단하여 프로젝트 종료후에 활동이 줄어드는 것이 아니라, 지속적인 거버넌싱과 프로젝트 추진을 진행할 것임을 약속합니다.


* 과제명: 개방형OS 기반 고객의 소리(VOC) 분석 환경 및 인공지능용 학습 데이터 구축 시스템의 개발
* 수행기간: 2019년 6월 1일 ~ 2019년 11월 30일
* 정부지원금: 150,000천원
* 현물부담금: 24,000천원
* 총 예산: 174,000천원
* 참여기관: (주)리노스, (주)토피도, (주)아와소프트
* 수요기관: 한국도로공사

