> 본 포스팅은 과제로 진행했던 URL Shortener 설계에 대해서 정리하고 회고해보는 포스팅입니다.
> 직접구현된 내용은 아니며 단순한 프론트엔드 및 (백엔드 지식이 전무한 프론트엔드 개발자의) 백엔드 설계입니다.

## 들어가며...

처음 과제를 받고 나서 설계라는 말에 지레 겁먹었다. 하지만 생각해보면 사이드 프로젝트를 진행하면서도, 프로젝트를 진행하면서도 고려했던 많은 것들이 결국 설계와 관련된 것들이라는 것을 깨닫고 하나씩 차근 차근해나가보았다. 미숙한 부분들도 많았으나 이를 통해서 조금씩 발전하겠지 싶다. 휘발되는 기억들로 남기고 싶진 않으니 간략하게라도 정리해둔다.

# URL Shortener가 무엇인가요?

URL 단축기라고 불리는 서비스는 구글에 검색하면 정말 다양하게 검색이 된다. 그 중 단연 가장 유명한 서비스는 bit.ly(이하 비틀리)일 것이고 현재는 사용이 중단되었으나 goo.gl 과도 같은 대형기업에서 제공하던 단축기도 있었다.

개발에 대한 지식이 전무하던 시절 이런 서비스들은 도메인 자체를 마치 암호화하듯 줄여서 제공하는 것으로 생각하였으나, 과제를 위해 공부를 하다보니 62진수를 활용해 기존 Original URL으로 리다이렉션되는 짧은 URL을 사용자에게 제공하는 것이었다. 이를 제공하기 위해 서버에 정보를 저장해야하는데 이때문에 도메인은 짧으면 짧을 수록 서버비용이 낮아질 수 밖에 없다. URL단축기라는 상징성에서 서비스들의 도메인이 짧은 것도 있지만 서비스의 비용적 측면에서도 도메인은 짧아야하는 것이다.

> 대략적인 계산에 따르면 7자리 정도 활용한 62진수의 경우 최대 3.5조개 가량의 도메인을 저장가능하고 비틀리는 350억개 가량의 짧은 URL을 저장하고 있다고 한다. 비틀리가 대형 서비스이긴 하나 비틀리를 기준으로 도메인 1글자 당 35기가 가량의 데이터가 더 소모된다.(3.5조개를 꽉 채울 경우 3.5테라 가량의 데이터 용량 차이)

---

# 짧은 도메인은 선정했다치고, 어떤 기능을 구현해야해?

기능 부분에 대해서는 Front와 Back을 나누어서 생각했다. 설계적인 부분이 현업에서는 어떻게 이루어지는 지 취준생 개발자로서 알 도리가 없으나 설계단계에서는 프론트엔드보다 백엔드 설계의 디테일이 서비스의 비용적 측면에서 더 중요할 것 같았다. 그래서 프론트엔드 과제임에도 백엔드를 생각해가며 설계를 했는데 아래와 같이 각 3가지의 주요기능을 생각했다.

### 프론트엔드

- 사용자가 입력한 Long URL을 서버로 넘겨주는 기능

- 서버로부터 데이터를 받아 화면에 렌더링하는 기능

- 로그인 정보를 받아와 로그인 여부에 따라 노출되는 페이지를 다르게 렌더링하도록 함

### 백엔드

- URL 단축기능 - URL Shortener

- 단축된 URL을 통해 접속했을 때 보관된 데이터에 접근해 긴 URL로 리다이렉션해주는 기능 - URL Mapper

- 보관기한이 지나면 자동으로 데이터를 삭제해주는 기능 - Cleanup Function

> 위 그림은 서비스가 어떻게 동작하는 지 간략하게 그렸던 그림인데 사실 아직도 Cleanup Function이 어디에서 동작해야하는 지 모르겠다. 다만 내가 생각하고 의도한 것은 JS의 가비지 컬렉터처럼 DB를 계속해서 보고 있다가 특정 보관기간(일반적으로 5-10년)이 지난 데이터를 자동으로 삭제해줄 수 있는 기능을 의도했다.

---

# 본격적인 설계

## 프론트엔드 설계

> 프론트엔드 설계는 크게 고려해야할 사안과 스택, 필요 API 세가지 파트로 나누었다.
> 화면을 구성하는 프론트엔드의 개발 주기는 서비스 내용이 추가되거나 변경되는 일이 잦고 심지어 그 주기가 짧다는 특징이 있기 때문에 프론트엔드 아키텍쳐를 구상하는 것에 있어서 핵심 키워드는 재사용성이라고 생각했다.
>
> 다만 이 과정에서 생각한 디자인패턴이 지금 생각해봤을 때는 리스크가 크다라는 생각이 들기는 한다.
>
> 아무튼 고려해야할 사안은 크게 6가지로 작성했다.

### 고려해야할 사안

1. UI 디자인 패턴

- 아토믹 디자인을 적용해 UI를 작고 단순한 요소로 분리합니다. 이를 통해 일관된 UI를 제작할 수 있고 높은 재사용성 및 유지보수의 용이성을 기대할 수 있다.
- 만약 디자이너가 없는 경우에는 MUI 같은 규격화된 라이브러리를 통해 디자인 패턴을 설계한 것과 같은 효과를 부수적으로 누릴 수 있다.
  > 제출한 과제에서는 아토믹 디자인을 사용한 디자인패턴을 고려했는데, 사실 이 아토믹 디자인 자체가 굉장히 논란이 많은 디자인 패턴이므로 실제 서비스를 설계할 때 쉽게 도입하기는 어려운 것 같다. 물론, 알게 모르게 아토믹 디자인과 비슷한 식으로 컴포넌트를 분리하고 사용하는 경우가 많으나 요소 및 컴포넌트를 atoms, molecules, organisms, templates, pages 라는 5단계로 나누는 것 자체가 모호할 수 밖에 없다. 디자이너와 개발자 사이의 수많은 회의가 필요하고 서비스가 커지면 커질 수록 방대한 분량의 디자인 스펙 시트가 필요한 만큼 비틀리 규모의 서비스를 제공한다고 해도 재사용성의 이점을 생각하며 아토믹 디자인 패턴을 도입할 필요는 전혀 없을 듯 하다.

2. 상태관리

- 단순 URL 단축서비스는 클라이언트에서 전역상태로 관리할 상태가 로그인 정보, 회원 정보 등 지극히 제한적이나, 추후 추가 수집정보를 활용한 서비스 확장이 고려될 수 있으므로 최초 개발 단계부터 전역상태관리를 세팅한다.
  > 클라이언트 상태관리의 경우 이제는 초기 설계단계에서 필수 아닌 필수가 된 듯하다. 물론 사용하지 않아도 무방하겠지만, 서비스를 처음 개발하는 단계에서 도입하지 않는다면 추후 방대해진 코드에 전역상태관리를 도입하기 어렵다. 만약 이 서비스를 통해 추가적인 사업확장을 할 계획이라면 상태관리는 초기 단계에서부터 사용하는 것이 맞다고 생각했다.

3. API 관리

- API_KEY와 API를 사용하는 로직은 api폴더로 따로 분리해 관리한다. api로직을 export해 필요 시 손쉽게 사용가능하고 변경 사항 적용이 쉬워진다.
- CRUD와 관련된 함수명의 경우 getURL, postURL과 같은 형식으로 어떤 기능을 가지는 지 어떤 데이터를 다루는 지 등을 명확하게 기재해 관리한다.
  > API 관리에 대해서는 사람마다 의견이 분분하나 나는 API 폴더를 만들어 관리하는 것이 가장 무난하게 다들 동의하는 관리 방법이지 않나 싶다.

4. 폴더 구조

- 폴더구조를 설계할 때는 아토믹 디자인 패턴을 고려해 설계해야한다.
- 아토믹 디자인의 폴더구조는 최소단위인 atoms, atom이 여러개 결합된 molecules, molecule 또는 atom이 서로 결합된 organisms, 데이터를 포함하지 않은 화면영역인 templates, 데이터를 포함한 pages 가 있다.
- 위 5계층의 폴더구조는 molecule과 organism, template와 pages와 같은 구분이 모호한 부분을 합쳐 3계층 구조(atoms, molecules, pages)로도 나눌 수 있다.
- 이 단위로 폴더 구조를 작성할 때에는 아토믹 관련 폴더 사이에 다른 폴더들이 섞여들 수 있어 언더바를 활용해 네이밍 해준다. (ex. \_Atoms, \_Molecules)
  > 폴더구조야말로 설계의 전부이지 않을까 싶다. UI 디자인 패턴을 아토믹 디자인 패턴으로 하자고 했기 때문에 그에 대한 폴더구조를 언급하였으나 이외에도 위 API폴더와 constant 폴더, custom hook 폴더 등 더 많은 것들이 고려되었어야 했다.

5. ESLint, Prettier (컨벤션)

- 통일된 코드 컨벤션을 위해 ESLint와 Prettier를 설정해준다. 이를 통해 협업 시 저마다 다른 코드 작성 스타일을 통일할 수 있다. ESLint는 Airbnb 스타일을 활용하는 것을 고려한다.
  > 개발자마다 코드 스타일은 정말 제각각이다. 개인 프로젝트를 다루는 것이라면 컨벤션이 필요하겠냐만, 여러 개발자와 같이 협업해야하는 상황에서 코드 컨벤션을 정하고 시작할 필요가 있다. 특히 Prettier와 ESLint 설정은 중요한데, Prettier의 경우 당연히 tap size나 세미클론, 따옴표 스타일 등이 다 다르니 설정해주는 것이 좋고 Lint는 문법적 오류를 잡는 것에 용이하다.
  >
  > ESLint 스타일을 흔히들 많이 사용하는 google, airbnb, standard 중 Airbnb로 설정하자고 한 이유는 google은 리액트를 지원하지 않고, standard는 세미클론을 사용하지 못한다는 규칙이 있어 Airbnb로 선택했다.
  >
  > (Airbnb Style 써본 적 있어?) 사이드프로젝트를 진행할 때는 ESLint 기본스타일을 적용하였으나 서비스를 상용화할 계획이라면 앞으로 조금 더 안정적인 개발환경을 위해 규칙이 더 팍팍한(...) Airbnb가 맞다고 생각했다.

6. Route 설계

- 서비스는 대시보드 위주로 기능이 구현되기 때문에 (URL단축서비스 한정으로) 생성되는 route가 다양하지 않으나 로그인 페이지(메인페이지)를 루트 페이지로 하여 회원가입, 유저 대시보드, 어드민 페이지 3가지를 필수적으로 구성해야한다. 나머지 route는 필요 시 구성한다.
- Route는 크게 동적 라우팅과 정적 라우팅으로 구분되며, user에 따라 달라지는 대시보드 페이지는 동적 라우팅으로 구성 그 외에는 정적 라우팅으로 구성한다.

  > 제출할 당시에는 간단한 소개를 곁들인 로그인 페이지를 메인 페이지로 하는 것을 생각하였으나 지금 생각해보면 GNB를 포함한 루트페이지를 구성하는 게 더 나았을 것 같다는 생각이 있다. 뭐 그것을 감안하더라도 route설계는 /login 라우트가 생기냐 마냐 정도 차이일 것이다.

---

### 사용 스택

1. Next.js (React)

- 단축 URL 서비스인만큼 구글 등 검색 엔진에 노출이 되어야한다. 하지만 CSR로 동작하는 React의 특성 상 SEO의 성능이 떨어진다는 단점이 있어 Next.js 를 활용해 이를 보완한다.
- SEO성능이 중요한 메인페이지의 경우 SSR로 개발을 진행하고 대시보드는 실시간 데이터 반영이 이루어지므로 CSR로 개발을 진행한다.
- React(Next.js)는 큰 커뮤니티를 보유하고 있어 비교적 문제상황에서의 해결이 쉽고, 사용자가 다른 프레임워크보다 많아 추후 개발자 채용에 있어 인재풀이 넓다.
  > 최초에 설계를 진행할 때는 SEO를 고려하지 않아 React를 생각했으나, 실제 서비스가 상용화가 될 경우 SEO 성능이 곧 수익과 직결될 것이기 때문에 Next.js를 사용하는 것으로 설계했다.

2. Recoil

- 보일러 플레이트가 적고 리액트 문법과 유사하게 사용 가능해 사용성이 좋다.
  > Redux로 전역상태관리를 접했으나 너무 많은 보일러플레이트로 인해 피로가 누적되는 감이 있었다. 그래서 최근 즐겨 사용하기 시작한 Atomic패턴의 Recoil을 선정했다. 하지만 Recoil은 현재 메이저 업데이트가 진행이 되고 있지 않은 상태이고 메타에서 Recoil 팀을 해고할 수 있다는 얘기를 들어 Recoil의 불확실성이 싫다면 비슷한 컨셉의 Jotai도 고려해볼 것 같다.

3. Styled Components

- SASS에 비해 컴포넌트 단위 재사용성이 좋다.
  > Next.js 13에서는 CSS IN JS를 공식적으로 지원한다. (물론 아직 지원안되는 라이브러리도 있다.) 그렇기떄문에 재사용성을 고려해 Styled-Components를 선정했다. SASS에 비해 성능이 떨어진다는(렌더링 속도가 느리다는) 단점이 있으나 서비스가 그정도로 리렌더링이 잦은 서비스가 아니므로 CSS IN JS의 사용성을 선택했다.

4. TypeScript

- 정적 타이핑을 통해 타입에러를 줄일 수 있다.
  > 말해 뭐해..

---

### 필요한 API (USER)

1. 회원정보

- 요청사항 : 이름, UID, 저장되어있는 단축 URL, 어드민 유무 등을 포함한 JSON 포멧

2. 간편로그인 연동 (구글, 카카오 등)

- 요청사항 : 간편 로그인을 위한 API 연동 작업

3. (Long URL 제출 시) 단축 URL 제공

- 요청사항 : Long URL 제출 시 사용자의 화면에 노출시켜줄 단축 URL

4. 통계데이터

- 요청사항 : 단축 URL 접속횟수와 같은 통계 데이터 및 시간대 등 각종 통계 데이터

### 필요한 API (ADMIN)

1. 통계데이터

- 요청사항 : DB에 저장되어있는 단축 URL개수, 각종 수집정보를 포함한 JSON포멧

> API 요청사항의 경우에는 단순히 필요할 것 같은 것들을 나열했는데, 대시보드에 노출해야하는 서비스이므로 유저 데이터도 어드민 데이터도 모두 대시보드에 필요한 데이터로 요청

---

## 백엔드 설계

> 백엔드 설계의 경우 잦은 변화에 따른 빠른 개발을 위한 재사용성에 초점이 있는 프론트엔드와는 달리 안정성과 비용절감이 중요하다고 생각한다. 다만 백엔드에 대한 지식이 많지 않은터라 효율적인 로직인지는 파악이 어렵다.

### 데이터 구조

> 데이터 구조에 포함되어야 하는 것들은 당연하게도 단축URL 정보였다. 사용자는 최대 10개까지의 단축 URL을 저장할 수 있도록 세팅이 되도록 하며, 각 데이터 마다 원본URL, 단축URL, 단축URL을 통해 접속한 사람들의 데이터를 수집해 Push해줄 배열, 그리고 현재 삭제되지 않고 정상 동작 중인 단축URL임을 나타내는 active, 이 4가지를 데이터 구조로 작성했다.

---

### 데이터 저장

- Input으로 부터 제출된 원본 URL이 DB에 존재하는 지 비교해 검증한다.
- 원본 URL이 DB에 속하지 않았다면 URL shortener를 통해 단축URL을 생성하고 DB에 저장합니다. 만약 중복된 URL이라면 에러를 반환하고 프론트단에서 이미 변환된 URL입니다 라는 팝업을 띄운다.

---

### 데이터 삭제

- 데이터가 삭제되는 케이스는 사용자의 요청 또는 보관기한이 지나 끝나는 2가지 경우
- 그 중 보관기한이 지났을 때 삭제되는 기능을 필수적으로 구현해야한다. 이 부분은 서비스 비용과 직접적으로 닿아있다.
  > 어떤 식으로 구현해야할 지는 모르나 비용적인 부분에서 누수가 없도록 하는 필수기능으로 보인다.

---

### 보안

- 단축 URL은 시각적으로 어떤 사이트에 접속하는 것인 지 파악이 불가능해 피싱 사이트 등으로 접속하는 URL인 경우 사용자가 큰 피해를 입을 수 있다. 그렇기 떄문에 이런 피해를 막을 수 있는 철저한 검증 솔루션이 필요해 보인다.
- 삭제된 단축 URL에 접속했을 시에 안내를 위해 리다이렉션되는 페이지를 만들 것 인지에 대한 고민이 필요하다. 만약 기능을 제공하지 않고 바로 삭제된 단축 URL에 다른 URL을 할당할 경우 피싱범죄는 물론 다양한 피해가 발생할 수 있다.
  > 단축 URL 서비스의 가장 큰 문제가 보안적 측면일 것이다. 이에 대해 백엔드 파트 설계 시 필수적으로 고려되어야 할 것 같다.

---

## 끝. 마무리

실무를 경험해보지 못해 실제로 프로젝트가 설계되는 단계를 경험해보진 못하였으나, 프로젝트를 처음부터 구상한다면 필요할 것 같은 것들을 생각해 작성했다. 설계를 경험해보면서 느낀 점은 개발자가 아무리 개발을 잘한다고 해도 설계 단계에서 제대로 고려되지 못한 부분이 있다면 회사는(또는 서비스는) 필연적으로 어려움에 직면할 수 밖에 없을 것이라는 생각이 든다.

내가 조금 더 다양한 분야에서 지식을 습득해야겠구나 싶은 과제기도 했고, 앞으로 더 나은 프론트엔드 개발자로서 성장하려면 설계부터 진행하는 프로젝트를 많이 경험해봐야겠다는 생각도 드는 과제였다. 재밌었다 과제야!

~~이상 해당 과제전형은 합격했으나 최종에서 탈락한 자로서 최소한 회고는 필요할 것 같아 진행한 과제 회고였다-~~
