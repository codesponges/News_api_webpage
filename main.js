
let news = [];
let page = 1;
let total_pages = 0;
let url;
let inputArea = document.getElementById("input-area");
let searchButton = document.getElementById("searchButton");
let menus = document.querySelectorAll(".menus button");

menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)))
 
inputArea.addEventListener("click", () => {inputArea.value = "";})


const getLateNews = async () => { 
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`)
    getNews();
}


const getNews = async () => {

    try{
        let header = new Headers( {'x-api-key' : 'F0A9gzK8_ZXOL0Ax7_bOfvsRwd_6zgbYQwq0gr7i5G8'})

        url.searchParams.set('page', page); // &page=
        console.log(
            "url은?", url)
        let response = await fetch(url, {headers: header}); // fetch는 비동기 처리로 api를 호출하는 방식으로 반드시 await, async를 함께 써야 정상 동작한다
    
        let data = await response.json(); // 받아온 response에서 ReadableStream을 보려면 json() 타입으로 변환해줘야 한다
        if(response.status == 200){
            if(data.total_hits == 0) {
                throw new Error("검색된 결과값이 없습니다") // 만약 data.total_hits == 0 조건을 만족한다면 try-catch문에 의해서 현재 위치에서 catch {} 코드의 위치로 이동하며 하단의 코드는 실행되지 않는다
            }
            console.log("받는 데이터가 뭐지?", data)
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            console.log(data); // 받아온 데이터들에 어떠한 정보들이 있는지 살펴볼 것
            console.log(news); // 내가 생각한 내용들이 출력되는지 확인하는 습관을 들일 것
            render(); // render()함수도 데이터가 있어야 가능하다
            pagenation();
        } else {
            throw new Error(data.message)
        }
    }catch(error){
        console.log("잡힌 에러는", error.message);
        errorRender(error.message);
    } 
}

const errorRender = (message) => {
    let errorHTML = `<div class="text-center alert alert-warning" role="alert">
  ${message}
</div>`
    document.getElementById("news-board").innerHTML = errorHTML;
}


const pagenation = () => {
    let pagenationHTML = ``;
    // total_page
    // page : 현재 페이지
    // page group
    let pageGroup = Math.ceil(page/5)
    // last
    let last = pageGroup * 5
    // first
    let first = last - 4;
    // first ~ last 페이지 프린트


    // total_page 3일 경우 3개의 페이지만 프린트 하는법 last, first
    // << >> 이 버튼 만들어주기 맨처음, 맨끝으로 가는 버튼 만들기
    // 내가 그룹1 일 때 << <  이 버튼이 없다
   if(page == 1) { // << < 가 없어야 한다
    for( let i=first; i<=last; i++){
        pagenationHTML += 
        `<li class="page-item ${page == i? "active" : ""}"><a class="page-link" onclick="moveToPage(${i})" href="#">${i}</a></li>`
    }

    pagenationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
      <span aria-hidden="true" >&gt;</span>
    </a>
  </li>
  <li class="page-item">
      <a class="page-link"  onclick="moveToPage(${last})" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `
   } else if(page == last) {
   // 내가 마지막 그룹일 때 > >> 이 버튼이 없다
   pagenationHTML = `<li class="page-item">
   <a class="page-link" href="#" onclick="moveToPage(${first})" aria-label="Previous">
     <span aria-hidden="true">&laquo;</span>
   </a>
 </li>
   <li class="page-item">
   <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
     <span aria-hidden="true" >&lt;</span>
   </a>
 </li>
 `
    for( let i=first; i<=last; i++){
        pagenationHTML += 
        `<li class="page-item ${page == i? "active" : ""}"><a class="page-link" onclick="moveToPage(${i})" href="#">${i}</a></li>`
    }
  } else {
    
    pagenationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
      <span aria-hidden="true" >&lt;</span>
    </a>
  </li>`

    for( let i=first; i<=last; i++){
        pagenationHTML += 
        `<li class="page-item ${page == i? "active" : ""}"><a class="page-link" onclick="moveToPage(${i})" href="#">${i}</a></li>`
    }

    pagenationHTML +=`<li class="page-item">
    <a class="page-link" href="#" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>`
  }
   
    document.querySelector(".pagination").innerHTML = pagenationHTML;
}


const moveToPage = (pageNum) => {
    // 이동하고 싶은 페이지를 알 것
    page = pageNum;
    // 이동하고 싶은 페이지를 가지고 api를 다시 호출할 것
    getNews();
}



const getNewsByTopic = async (event) => { // 카테고리 메뉴들을 이용해 뉴스를 보는 함수
    let topic = event.target.textContent.toLowerCase();
    
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`)
    getNews();
}




const getNewsByKeyword = async () => { // 내가 입력한 키워드에 맞는 뉴스를 볼 수 있도록 하는 함수
    let keyword = inputArea.value;

    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`);
    getNews();
}



const render = () => { // 조건에 해당하는 결과들을 화면에 보여주는 render() 함수
    let newsHTML = "";

    newsHTML = news.map((article) => {
        return `<div class="row">
        <div class="col-lg-4">
            <img src="${article.media}" onerror="this.src='./image/no image.jpg'"/>
        </div>
        <div class="col-lg-8">
            <h2>
                ${article.title}
            </h2>
            <div>
                ${article.summary}
            </div>
            <div>
                ${article.country} * ${article.published_date}
            </div>
        </div>
    </div>`
    }).join('');

    document.getElementById("news-board").innerHTML = newsHTML;
}



getLateNews(); // 흔히들 하는 실수는 함수를 만들고 나서 호출하지 않는 것
searchButton.addEventListener("click", getNewsByKeyword);