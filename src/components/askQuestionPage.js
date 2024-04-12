import React from 'react'
export default class askQuestion extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            titleError: false,
            textError: false,
            textError_hyperlink: false,
            tagsError1: false,
            tagsError2: false,
            tagsError3: false,
            usernameError: false,
        }
    }
    handlePoseQuestionBtn(){
        const { changePage, model } = this.props;
        const titleInput = document.getElementById('ask_question_input1').value.trim();
        const textInput = document.getElementById('ask_question_input2').value.trim();
        const tagsInput = document.getElementById('ask_question_input3').value.trim();
        const usernameInput = document.getElementById('ask_question_input4').value.trim();

        let valid_pose = 1;
        // Check if any of the inputs is empty
        if (!titleInput || titleInput.length > 100) {
            this.setState({ titleError: true });
            valid_pose = 0;
        } else {
            this.setState({ titleError: false });
        }

        if (!textInput) {
            this.setState({ textError: true });
            valid_pose = 0;
        } else {
            // check existed http links
            let match_texts = textInput.match(/\[(.*?)\]\((.*?)\)/g);
            let valid_input = true;
            // check link starts with https:// and http://
            if (match_texts != null){
                valid_input = match_texts.every(text => {
                    let linkIndex = text.indexOf('(');
                    let showText = text.indexOf('[');
                    let link = text.slice(linkIndex+1, -1)
                    text = text.slice(showText+1, linkIndex-1);

                    if ((link.startsWith('https://') || link.startsWith('http://')) && text.length !== 0){
                        return true
                    }
                    return false;
                })
            }
            // if input valid
            if (valid_input){
                this.setState({ textError: false });
                this.setState({ TextError_hyperlink: false });
            }
            // if hyperlink not match rule, show error message
            else{
                valid_pose = 0;
                this.setState({ textError_hyperlink: true });
            }
        }

        let tagList = tagsInput.toLowerCase().split(/\s+/);
        if (!tagsInput) {
            this.setState({ tagsError3: true });
            this.setState({ tagsError1: false });
            this.setState({ tagsError2: false });
            valid_pose = 0;
        } else {
            let invalid = 0;
            // check tag match the syntax rule
            if (tagList.length > 5) {
                this.setState({ tagsError1: true });
                this.setState({ tagsError2: false });
                this.setState({ tagsError3: false });
                invalid += 1;
                valid_pose = 0;
            }
            if (tagList.some(tag => tag.length > 20)){
                this.setState({ tagsError1: false });
                this.setState({ tagsError2: true });
                this.setState({ tagsError3: false });
                valid_pose = 0;
                invalid += 1;
            }
            if (invalid === 0){ 
                this.setState({ tagsError1: false });
                this.setState({ tagsError2: false });
                this.setState({ tagsError3: false });

            }
        }

        if (!usernameInput) {
            this.setState({ usernameError: true });
            valid_pose = 0;
        } else {
            this.setState({ usernameError: false });
        }

        // pose questions
        if (titleInput && textInput && tagsInput && usernameInput && valid_pose !== 0) { 
            // add new tags into model
            let tags_id_list = new Set(); //Tid list
            for (let i = 0; i < tagList.length; i++){
                let current_tag = model.getTag(tagList[i]);
                // If it is a new tag
                if (current_tag === undefined){
                let tagId = "t" + model.data.tags.length+1;
                current_tag = {
                    tid: tagId,
                    name: tagList[i]
                }
                model.insertTag(current_tag);
                }
                tags_id_list.add(current_tag.tid);
            }
            tags_id_list = Array.from(tags_id_list);
            // Create question object
            const question = {
              qid: 'q' + (model.data.questions.length+1),
              title: titleInput,
              text: textInput,
              tagIds: tags_id_list,
              askedBy: usernameInput,
              askDate: new Date(),
              ansIds: [],
              views: 0
            };
            model.insertQuestion(question);
            changePage("QuestionsPage");
        }
    }
    render(){
        return(
            <div id='frame'>
                <div id="ask_question_frame" className="ask_question_frame">
                    <TitleInput titleError={this.state.titleError}/>
                    <TextInput textError={this.state.textError} textError_hyperlink={this.state.textError_hyperlink}/>
                    <TagsInput tagsError1={this.state.tagsError1} tagsError2={this.state.tagsError2} tagsError3={this.state.tagsError3}/>
                    <UsernameInput usernameError={this.state.usernameError}/>
                    <button type="button" id="post_question_button" style={{marginLeft: '20%'}} onClick={() => this.handlePoseQuestionBtn()}>Post Question</button>
                    <p style={{display: 'inline-block', marginLeft: '20%', color: 'crimson'}}>*indicates mandatory fileds</p>
                </div>
            </div>
        )
    }
}
function TitleInput(props){
    const { titleError } = props;
    return(
        <>
            <h2 style={{paddingLeft: '20%'}}>Question Title*</h2>
            <p style={{fontStyle: 'italic', paddingLeft: '20%', marginLeft: '15px'}}>Limit title to 100 characters or less</p>
            <input className="ask_question_input" id="ask_question_input1" required/>
            <span className="error" id="titleError" 
            style={{display: titleError? 'block' : 'none'}}>
                Title must not exceed 100 characters and cannot be empty
            </span>
        </>
    )
}
function TextInput(props){
    const { textError, textError_hyperlink } = props;

    return(
        <>
            <h2 style={{paddingLeft: '20%'}}>Question Text*</h2>
            <p style={{fontStyle: 'italic', paddingLeft: '20%', marginLeft: '15px'}}>Add details</p>
            <textarea className="ask_question_input" id="ask_question_input2" required></textarea>
            <span className="error" id="textError" 
            style={{display: textError? 'block': 'none'}}>
                Question text cannot be empty
            </span>
            <span className="error" id="textError_hyperlink" 
            style={{display: textError_hyperlink? 'block': 'none'}}>
                [] can't be empty and hyperlink () must start with https:// or http://
            </span>
        </>
    )
}
function TagsInput(props){
    const { tagsError1, tagsError2, tagsError3 } = props
    return(
        <>
            <h2 style={{paddingLeft: '20%', marginBottom: '5px'}}>Tags*</h2>
            <p style={{fontStyle: 'italic', paddingLeft: '20%', marginLeft: '15px', marginTop: '0px'}}>Add keywords separated by whitespace</p>
            <input className="ask_question_input" id="ask_question_input3"required/>
            <span className="error" id="tagsErro1" 
            style={{display: tagsError1? 'block': 'none'}}>
                Enter up and to 5 tags separated by whitespace
             </span>
             <span className="error" id="tagsError2" 
            style={{display: tagsError2? 'block': 'none'}}>
                Each tag length should be less than 20 words
             </span>
             <span className="error" id="tagsErro3" 
            style={{display: tagsError3? 'block': 'none'}}>
                Tags can't be empty
             </span>
        </>
    )
}

function UsernameInput(props){
    const { usernameError } = props;
    return(
        <>
            <h2 style={{paddingLeft: '20%'}}>Username*</h2>
            <input className="ask_question_input" id="ask_question_input4"required/>
            <span className="error" id="usernameError" 
            style={{display: usernameError? 'block' : 'none'}}>
                Username cannot be empty
            </span>
        </>
    )
}