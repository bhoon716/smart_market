# 스마트 전통 시장 by TEAM. 중꺾마

## 개요

- 지역 문제 해결 - 전통시장의 디지털화 & 스마트화
  - 전통시장의 편의성을 강화하여 방문 수요를 늘리는 방안.
  - 상인과 이용객 모두 편리하게 사용할 수 있는 모바일 웹 애플리케이션

### 주요 기능

1. 상인이 사진(매대 or 메뉴판)을 찍으면 ai가 분석하여 해당 가게의 메뉴를 정리함
   1-1. 상인은 해당 정보를 수정하거나 직접 추가할 수 있음
2. 상인이 자신의 가게 정보를 올릴 수 있음(상호명, 위치, 메뉴, 개폐 시간 등).
3. 이용객들이 오늘 뭘 살지 메모장에 적으면, 해당 물건을 파는 가게의 위치를 표시함. 만약 메모장 중 대파가 있을 때, 대파를 선택하면 대파를 어느 가게에서 파는 지 표시
   3-1. 단, 아직 열지 않았거나, 상인이 해당 물건을 품절로 표시한 경우는 구분하여 표시
4. 해당 전통 시장 정보와 시장 내에 어떤 편의 기능이 있는지 사용자에게 표시함
5. (선택) 계절 제철 물건 혹은 지역 특산품 등을 알려주는 배너
6. (선택) 가게 별 리뷰, 평점 기능
7. (선택) 맞춤형 알림 서비스: 특정 관심 상품/가게/할인 정보 등을 알려주는 서비스

### 기술 스택

- 백엔드: Node.js + Express
- 프론트엔드: 일단 쌩 HTML, CSS, JS만
- DB: MySQL
- 이미지 분석 AI: GPT 4o-mini API
- VCS: Github
- 배포: 기능 개발 다 하고 가능하면 시도(aws ec2, azure, koyeb 등)

### 팀원

- 박병훈: 팀장, 백엔드
- 문수혁: 백엔드
- 이재훈: 프론트엔드
- 이상은: 프론트엔드

#### 설치 해야하는 것

- vscode
- git
- nodejs
- mysql workbench, server

### 참고

- 구글 Docs - https://docs.google.com/document/d/14JPcYpuRteFyXwNETsGmfBpYzmKkhjQt9x6VFaXt3iA/edit?usp=sharing
- 인어교주해적단 홈페이지 - https://tpirates.com/
- git, github 애플코딩 강의 - https://codingapple.com/course/git-and-github/
- node.js 생활코딩 강의 - https://opentutorials.org/course/3332

### npm 설치 목록

- npm install express mysql2 dotenv
- npm install multer
- npm install axios

### DB 테이블 설계

1. store(상점)
   : Long id | String store_name | String category | String mainPicturePath| String location | TIME open_time | TIME close_time
2. menu(판매 물품 정보)
   : Long id | \*Long store_id | String item_name | Integer price | String itemPicturePath
3. member(유저)
   : Long id | String username | String password | String role

### 만들어야 하는 페이지와 기능

0. 메인 홈페이지
   - 로그인 버튼
   - 검색 버튼
   - 메모장
1. 로그인, 회원가입(상인)
2. 상점 페이지(상인)
   - 판매 목록, 판매 목록 수정 페이지 버튼
3. 판매 목록 수정 페이지

### 교수님들 피드백

- 물품 인식 AI 모델 구현
- 사진을 한 번이 아닌 여러 번 찍을 수 있도록 + 중복된 물품은 저장 X(유니크 조건)
