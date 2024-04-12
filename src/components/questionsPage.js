import React from 'react'

// header
function SortButtons(props){
    const { ClickSortButton } = props;
    const handle_SortClick= (sortType) =>{
        ClickSortButton(sortType);
    }
    return(
        <div id="sort_bottons" className="sort_buttons">
            <button type="button" id="Newest_sort" onClick={()=>handle_SortClick('Newest')}>Newest</button>
            <button type="button" id="Active_sort" onClick={()=>handle_SortClick('Active')}>Active</button>
            <button type="button" id="Unanswered" onClick={()=>handle_SortClick('Unanswered')}>Unanswered</button>
        </div>
    )
}
function Header1(props){
    const { search,changePage } = props;
    const handle_AskQuestionClick = () =>{
        changePage('AskQuestionPage');
    };
    return(
        <div id="sub_header" className="sub_header">
            <h3 id="sub_header_content">{search === ''? "All Questions" : "Search Results"}</h3>
            <div id="askQuestion_div" className="askQuestion_div">
                <button id="askQuestion" className="askQuestion" 
                onClick={handle_AskQuestionClick}>
                    Ask Question
                </button>
            </div>
        </div>
    )
}
function Header2(props){
    const { questions, ClickSortButton } = props;
    return(
        <div id="sub_header2" className="sub_header2">
            <p id="num_question_frame">{questions.length === 1? '1 questions': `${questions.length} questions`}</p>
            <SortButtons ClickSortButton={ClickSortButton}/>
        </div>
    )
}
function QuestionsPageHeader(props){
    const ClickSortButton = props.ClickSortButton;
    const { search, changePage, questions } = props;
    return(
    <>
        <Header1 search={search} changePage={changePage}/>
        <Header2 questions={questions} ClickSortButton={ClickSortButton}/>
    </>
    )
};


//questions Lists
function AnsView(props){
    const { q } = props;
    return(
        <div className='ans_view'>
            <p>{q.ansIds.length === 1 ? '1 answer' : `${q.ansIds.length} answers`}</p>
            <p>{q.views === 1 ? '1 view' : `${q.views} views`}</p>
        </div>
    )
}
function Attributes(props){
    let q = props.question;
    let tags = props.tags;
    return(
    <div className ='attributes'>
        <ul>
            {(()=>{
                let content = [];
                for (const tagId of q.tagIds){
                    let tagName = tags.find(tag => tag.tid === tagId)?.name;
                    content.push(<li key={tagId}>{tagName}</li>);
                }
                return content;
            })()
            }
        </ul>
    </div>
    )
}
function PoseQuestionTime(props){
    let { question,model } = props;
    const formatQuestionMetadata = model.formatQuestionMetadata;
    return(
        <div className='pose_time'>
        <p className='name'>{question.askedBy} </p>
        <p style={{fontStyle: 'italic'}}>asked {formatQuestionMetadata(question.askDate)}</p>
        </div>
    )
}
class QuestionList extends React.Component{
    // constructor(props){
    //     super(props);
    // }
    render() {
        const { model, changePage, ClickQuestionTitle, questions } = this.props;
        let tags = model.data.tags;

        // this the regular expression for extract hyperLink
        const reg = /\[(.*?)\]\((.*?)\)/g;
        function formatHyperlink(text){
            text = text.replace(reg, (match, t, url) => {
                return `${t}`;
            });
            return text;
        };

        return (
            <div id='pose_questions'>
                {questions.length > 0? (questions.map((q) => (
                    <div id='pose_question' key={q.qid}>
                        <AnsView q={q}/>
                        <div className='question'>
                            <h2 id={q.qid} 
                            style={{ cursor: 'pointer' }} 
                            onClick={()=>{
                                changePage('AnswersPage'); 
                                ClickQuestionTitle(q.qid)}}>
                                {formatHyperlink(q.title)}
                            </h2>
                            <Attributes question={q} tags={tags}/>
                        </div>
                        <PoseQuestionTime question={q} model={model}/>
                    </div>
                ))): (
                    <h2 style=
                    {{
                        paddingLeft : '5%',
                        paddingTop: '10px',
                    }}>
                        No Questions Found
                    </h2>
                )}
            </div>
        );
    }
}
function handle_sort(sort, model, search){
    let questions = model.data.questions;
    // check sorting type
    if (sort === 'Newest'){
        questions = model.sort_question_by_date(questions);
    }
    else if (sort === "Active"){
        questions = model.sort_question_by_active(questions);
    }
    else if (sort === "Unanswered"){
        questions = model.sort_question_by_unanswered(questions);
    }
    //check search match questions
    if (search !== ""){
        questions = model.searchQuestionsByText(search,questions);
    }
    return questions
}
export default class QuestionsPage extends React.Component {
    // constructor(props){
    //     super(props);
    // }
    render(){
        const { model, changePage, ClickQuestionTitle, sort, ClickSortButton, search } = this.props;
        let questions = handle_sort(sort, model, search);
        return(
            <div id='frame'>
                <QuestionsPageHeader 
                questions={questions}
                changePage={changePage}
                ClickSortButton={ClickSortButton}
                search={search}/>

                <QuestionList 
                model={model}
                questions={questions}
                changePage={changePage} 
                ClickQuestionTitle={ClickQuestionTitle}
                sort={sort}
                search={search}
                />
            </div>
        )
    }
}