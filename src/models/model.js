export default class Model {
  constructor() {
    this.data = {
      questions: [
                  {
                    qid: 'q1',
                    title: 'Programmatically navigate using React router',
                    text: 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
                    tagIds: ['t1', 't2'],
                    askedBy : 'JoJi John',
                    askDate: new Date('December 17, 2020 03:24:00'),
                    ansIds: ['a1', 'a2'],
                    views: 10,
                  },
                  {
                    qid: 'q2',
                    title: 'android studio save string shared preference, start activity and load the saved string',
                    text: 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
                    tagIds: ['t3', 't4', 't2'],
                    askedBy : 'saltyPeter',
                    askDate: new Date('January 01, 2022 21:06:12'),
                    ansIds: ['a3', 'a4', 'a5'],
                    views: 121,
                  }
                ],
      tags: [
        {
          tid: 't1',
          name: 'react',
        },
        {
          tid: 't2',
          name: 'javascript',
        },
        {
          tid: 't3',
          name: 'android-studio',
        },
        {
          tid: 't4',
          name: 'shared-preferences',
        }
      ],

      answers: [
        {
          aid: 'a1',
          text: 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.',
          ansBy: 'hamkalo',
          ansDate: new Date('March 02, 2022 15:30:00'),
        },
        {
          aid: 'a2',
          text: 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
          ansBy: 'azad',
          ansDate: new Date('January 31, 2022 15:30:00'),
        },
        {
          aid: 'a3',
          text: 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
          ansBy: 'abaya',
          ansDate: new Date('April 21, 2022 15:25:22'),
        },
        {
          aid: 'a4',
          text: 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
          ansBy: 'alia',
          ansDate: new Date('December 02, 2022 02:20:59'),
        },
        {
          aid: 'a5',
          text: 'I just found all the above examples just too confusing, so I wrote my own. ',
          ansBy: 'sana',
          ansDate: new Date('December 31, 2022 20:20:59'),
        }
      ]
    };
  }
  // add methods to query, insert, and update the model here. E.g.,
  // getAllQstns() {
  //   return this.data.questions;
  // }
  sort_question_by_date(questions){
    const sorted_questions = questions.sort((a,b) =>{
      return (b.askDate - a.askDate);
    })
    return sorted_questions;
  }
  sort_question_by_unanswered(questions){
    return (
      questions.filter(q => ( q.ansIds.length === 0 ))
    )
  }
  sort_question_by_active(questions) {
    const sorted_questions = questions.sort((q1, q2) => {
        // Check if q1 has answers
        const q1_recent_ansId = q1.ansIds.length > 0 ? q1.ansIds.sort((a1, a2) => {
            a1 = this.getAnswerById(a1);
            a2 = this.getAnswerById(a2);
            return (a2.ansDate - a1.ansDate);
        })[0] : null;

        // Check if q2 has answers
        const q2_recent_ansId = q2.ansIds.length > 0 ? q2.ansIds.sort((a1, a2) => {
            a1 = this.getAnswerById(a1);
            a2 = this.getAnswerById(a2);
            return (a2.ansDate - a1.ansDate);
        })[0] : null;

        // Check if both questions have answers
        if (q1_recent_ansId && q2_recent_ansId) {
            const q1_recent_ans = this.getAnswerById(q1_recent_ansId);
            const q2_recent_ans = this.getAnswerById(q2_recent_ansId);
            return q2_recent_ans.ansDate - q1_recent_ans.ansDate;
        } else if (q1_recent_ansId) {
            // Only q1 has answers
            return -1; // Move q1 before q2
        } else if (q2_recent_ansId) {
            // Only q2 has answers
            return 1; // Move q2 before q1
        } else {
            // Neither question has answers
            return 0; // No change in order
        }
    });

    return sorted_questions;
  }

  get_question_by_id = (qid) =>{
    return (this.data.questions.find(q => q.qid === qid));
  }
  getAnswerById = (aid) =>{
    return this.data.answers.find(ans => ans.aid === aid);
  }

  getAnswerSortNewest = (question) =>{
    return question.ansIds.sort((a1, a2) =>
    (this.getAnswerById(a2).ansDate) - (this.getAnswerById(a1).ansDate)
    )
  }



  searchQuestionsByText = (searchText, questions) => {
    let searched_questions = questions.filter(q=>this.is_matched(q, searchText));
    return searched_questions;
  }
  is_matched(question, string){
    const text = question.text.toLowerCase()
    const title = question.title.toLowerCase();
    const tags = question.tagIds.map(tid =>{
      return this.getTagById(tid).name;
    })
    string = string.toLowerCase().trim();
    let stringList = string.split(/\s+/);
    const search_tags = stringList.filter(e => {
      return e.startsWith('[') && e.endsWith(']');

    }).map(tag => tag.slice(1, -1));


    const search_text = stringList.filter(e => {
      return !(e.startsWith('[') && e.endsWith(']'));
    })

    let is_search_text_match = search_text.length > 0 ? search_text.every((word) => {
      return (text.includes(word) || title.includes(word));
    }) : false;
 
    let is_any_tag_match = search_tags.length > 0 ? search_tags.some(search_tag => {
      return tags.includes(search_tag);
    }) : false;

    return (is_search_text_match || is_any_tag_match);
  }

  //add new question
  insertQuestion(question){
    this.data.questions.push(question);
  }
  // add new tags
  insertTag(tag){
    this.data.tags.push(tag);
  }
  // check if this tag existed
  getTag(name){
    return this.data.tags.find(tag=> tag.name === name);
  }
    // check if this tag id existed
  getTagById(tid){
    return this.data.tags.find(tag=> tag.tid === tid);
  }
  // insert answer
  insertAnswer(answer, qid){
    this.data.answers.push(answer);
    const question = this.data.questions.find(q => q.qid === qid);
    if (question) {
        question.ansIds.push(answer.aid);
    }
  }






  // for time format
  formatQuestionMetadata(postingDate) {
    const currentDate = new Date();
    const secondsInDay = 24 * 60 * 60;
    const secondsInHour = 60 * 60;
    
    const timeDifferenceInSeconds = (currentDate - postingDate) / 1000; // Convert milliseconds to seconds
    
    if (timeDifferenceInSeconds < 60) {
        return `${Math.floor(timeDifferenceInSeconds)} seconds ago`;
    } else if (timeDifferenceInSeconds < secondsInHour) {
        return `${Math.floor(timeDifferenceInSeconds / 60)} minutes ago`;
    } else if (timeDifferenceInSeconds < secondsInDay) {
        return `${Math.floor(timeDifferenceInSeconds / 3600)} hours ago`;
    } else if (currentDate.getFullYear() === postingDate.getFullYear()) { //in the same year
        return `${postingDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })} at ${postingDate.toLocaleString('en-US', {hour12: false, hour: 'numeric', minute: '2-digit'})}`;
    } else {
        return `${postingDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${postingDate.toLocaleString('en-US', {hour12: false, hour: 'numeric', minute: '2-digit'})}`;
    }
  }
}