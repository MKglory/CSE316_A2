import React from 'react';


export default class TagsPage extends React.Component{
    // constructor(props){
    //     super(props);
    // }
    render(){
        const {model, changePage, checkTagsQuestion, MenuHandleClick } = this.props;
        function showAllTagsQuestion(tagName){
            tagName = '[' + tagName + ']';
            MenuHandleClick('QuestionsBtn');
            changePage("QuestionsPage");
            checkTagsQuestion(tagName);
        }
        return(
            <div id="frame">
                <TagsHeader model={model} changePage={changePage}/>
                <TagsContainer 
                model={model}
                showAllTagsQuestion={showAllTagsQuestion}/>
            </div>
        )
    }
}
function TagsHeader(props){
    let tags = props.model.data.tags;
    let num_tags = tags.length;
    const { changePage } = props;
    const handle_AskQuestionClick = () =>{
        changePage('AskQuestionPage');
    };
    return (
        <div id="tags_header" className="tags_header">
            <h2 id="num_tags" className="num_tags">{num_tags} {num_tags === 1 ? 'tag': 'tags'}</h2>
            <h2>All Tags</h2>
            <div id="tags_askQuestion_div" className="tags_askQuestion_div">
                <button id="tags_askQuestion" className="tags_askQuestion"
                onClick = {()=>handle_AskQuestionClick()}>
                    Ask Question
                </button>
            </div>
        </div>
    )
}
function TagsContainer(props){
    let tags = props.model.data.tags;
    let questions = props.model.data.questions;
    const { showAllTagsQuestion } = props;

    const container = tags.map(tag => {
        // find the number of qustion with this tags
        let num_question = questions.reduce((num, question)=>{
            return (num + (question.tagIds.includes(tag.tid)?1:0));
        },0)
        return(
            <div className="tags_item" key={tag.tid}>
                <p id={tag.tid} 
                onClick={()=>showAllTagsQuestion(tag.name)}
                style={{
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor:'pointer'
                }}>
                    {tag.name}</p>
                <p>{num_question} {num_question === 1 ? 'question' : 'questions'}</p>
            </div>
        )
    })
    
    return(
        <div id="tags_container" className="tags_container">
            {container}
        </div>
    )
}