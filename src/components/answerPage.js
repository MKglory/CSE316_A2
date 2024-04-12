import React from 'react'

export default class AnswerPage extends React.Component{
    render(){
        const { qid, model, changePage, ClickQuestionTitle } = this.props;
        // this the regular expression for extract hyperLink
        const reg = /\[(.*?)\]\((.*?)\)/g;
        function formatHyperlink(text){
            text = text.replace(reg, (match, t, url) => {
                if (match){
                    return `<a href=${url} target="_blank">${t}</a>`;
                } else {
                    // If no match is found, return the original text
                    return `text`;
                }
            });
            return text;
        };
        return(
            <div id='frame'>
                <SubHeader qid={qid} model={model} changePage={changePage} formatHyperlink={formatHyperlink}/>
                <SubHeader2 qid={qid} model={model} formatHyperlink={formatHyperlink}/>
                <Answers qid={qid} model={model} formatHyperlink={formatHyperlink}/>
                <PoseButton qid={qid} ClickQuestionTitle={ClickQuestionTitle} changePage={changePage}/>
            </div>
            
        )
    }
}

function SubHeader(props){
    const { qid, model, changePage, formatHyperlink } = props;
    const question = model.get_question_by_id(qid);
    question.views = question.views + 1;
    const handle_AskQuestionClick = () =>{
        changePage('AskQuestionPage');
    };

    return(
        <div id="question_page_subHeader" className="question_page_subHeader">
            <h3 style={{flex: 1}}>{question.ansIds.length} {question.ansIds.length === 1? 'answer': 'answers'}</h3>
            <h4 style={{flex: 5, fontWeight: 'bold'}}>
            <div dangerouslySetInnerHTML={{ __html: formatHyperlink(question.title)}} />
            </h4>
            <div style={{flex: 2}} id="askQuestion_div" className="askQuestion_div">
            <button id="ans_page_askQuestion" 
            className="askQuestion"
            onClick={handle_AskQuestionClick}>
                Ask Question
            </button>
            </div>
        </div>
    );
}
function SubHeader2(props){
    const { qid, model, formatHyperlink } = props;
    const formatQuestionMetadata = model.formatQuestionMetadata;
    const question = model.get_question_by_id(qid);
    return(
        <div id="question_page_subHeader2" className="question_page_subHeader2">
            <h3 style={{flex: 2}}>{question.views} {question.views === 1? 'view': 'views'}</h3>
            <h3 style={{flex: 10}}>
                <div dangerouslySetInnerHTML={{ __html: formatHyperlink(question.text)}} />
            </h3>
            <div className='pose_time_answer_page'>
                <p className='name'>{question.askedBy}</p>
                <p style={{fontStyle: 'italic', color:'grey'}}>asked {formatQuestionMetadata(question.askDate)}</p>
            </div>
        </div>  
    )
}
function Answers(props){
    const { qid, model, formatHyperlink } = props;
    const formatQuestionMetadata = model.formatQuestionMetadata;
    const getAnswerSortNewest = model.getAnswerSortNewest;
    const getAnswerById = model.getAnswerById;
    const question = model.get_question_by_id(qid);
    const sorted_ansId = getAnswerSortNewest(question);
    const sorted_answers = sorted_ansId.map((aid) =>getAnswerById(aid))

    return (
        sorted_answers.length !== 0 ? (
            sorted_answers.map((ans) => (
                <div id="answer_in_question_answer_page" className="answer_in_question_answer_page" key={ans.ansId}>
                    <div id="answer_page_text" className="answer_page_text">
                        <div dangerouslySetInnerHTML={{ __html: formatHyperlink(ans.text) }} />
                    </div>
                    <div id="answer_page_askBy">
                        <p className="ansBy">{ans.ansBy}</p>
                        <p style={{ fontStyle: 'italic', color: 'grey' }}>answered {formatQuestionMetadata(ans.ansDate)}</p>
                    </div>
                </div>
            ))
        ) : <h2 style=
        {{
            paddingLeft : '5%',
            paddingTop: '10px',
        }}>
            No Answers Found
        </h2>
    );
}
function PoseButton(props){
    const { qid, changePage } = props
    return(
        <>
            <button id={qid} className="post_answer_button" onClick={()=>changePage('PoseAnswerPage')}>Pose Answer</button>
        </>
    )
}