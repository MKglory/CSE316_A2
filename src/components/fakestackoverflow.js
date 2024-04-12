import {useState} from 'react';
import Model from '../models/model.js';
import {Header, Menu} from './header&menu.js';
import QuestionsPage from './questionsPage.js'
import AnswersPage from './answerPage.js'
import TagsPage from './tagsPage.js';
import AskQuestionPage from './askQuestionPage.js'
import PoseQuestionPage from './poseAnswerPage.js'

const model = new Model();
export default function FakeStackOverflow() {
  // check which page I should render
  const [currentPage, setCurrentPage] = useState('QuestionsPage');
  const [clickQuestionQid, setClickQuestionQid] = useState('');
  const [sort, setSort] = useState('Newest'); // default sort by Newest
  const [search, setSearch] = useState("");
  const [activeBtn, setActiveBtn] = useState('QuestionsBtn') //menu button
  // handle the button color when I clicked the buttons
  const MenuHandleClick = (btn) => {
    setActiveBtn(btn);
    setSearch('');
    handleChangePage(btn === ('QuestionsBtn') ? 'QuestionsPage': 'TagsPage')
  }
  // Hanlder for switching page content
  const handleChangePage = (dest) => {
    if (dest !== 'QuestionsPage' && dest !== 'TagsPage'){
       setActiveBtn("");
       setSearch('');
    }
    setCurrentPage(dest);
    document.getElementById('header_search_input').value = "";
    setSort('Newest');
  }
  // For check specific question detail
  const clickQuestionTitleHandler = (qid) =>{
    setClickQuestionQid(qid);
    document.getElementById('header_search_input').value = "";
  }
  // handle for the three sort buttons
  const clickSortButton = (btn) =>{
    setSort(btn);
  }
  // handle reading search bar input
  const handleSearch = (value) =>{
    setActiveBtn("");
    setSearch(value);
    setCurrentPage('QuestionsPage');
    setSort('Newest');
  }
  
  // keep current page content
  let pageContent = '';
  if (currentPage === 'QuestionsPage'){
    pageContent = <QuestionsPage 
    changePage={handleChangePage} 
    model={model} 
    ClickQuestionTitle={clickQuestionTitleHandler}
    sort = {sort}
    ClickSortButton={clickSortButton}
    search={search}
    />;
  }
  else if (currentPage === 'TagsPage'){
    pageContent = <TagsPage 
    changePage={handleChangePage} 
    model={model}
    checkTagsQuestion={setSearch}
    MenuHandleClick={MenuHandleClick}/>
  }
  else if (currentPage === "AnswersPage"){
    pageContent = <AnswersPage 
    changePage={handleChangePage} 
    model={model} 
    qid={clickQuestionQid}
    ClickQuestionTitle={clickQuestionTitleHandler}/>
  }   
  else if (currentPage === 'AskQuestionPage'){
    pageContent = <AskQuestionPage
    changePage={handleChangePage} 
    model={model}/>
  }
  else if (currentPage === "PoseAnswerPage"){
    pageContent = <PoseQuestionPage
    changePage={handleChangePage}
    qid={clickQuestionQid}
    model={model}
    />
  }
  
  return (
    <div id='main' className='main'>
      <Header seatch={search} handleSearch={handleSearch}/>
      <Menu 
      activeBtn={activeBtn}
      handleClick={MenuHandleClick}/>
      {pageContent}
    </div>
  );
}
