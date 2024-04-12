function Header(props){
    const { handleSearch,search } = props; 
    const handleSearchChange = (e) =>{
        if (e.key === "Enter"){ 
            handleSearch(e.target.value);
        }
    }
    return(
        <div id='header'>
            <h1>Fake Stack Overflow</h1>
            <input placeholder="..." id='header_search_input' 
            onKeyDown={handleSearchChange}
            value={search}
            />
        </div>
    )
}

function Menu(props){
    const {activeBtn, handleClick } = props;
    return(
        <div id='menu'>
            <button type="button" 
            id={activeBtn === 'QuestionsBtn'?'Menu_btn_active':'Menu_btn_deactive'} 
            onClick={()=>handleClick('QuestionsBtn')}>
                Questions
            </button>

            <button type='button' 
            id={activeBtn === 'TagsBtn'?'Menu_btn_active':'Menu_btn_deactive'} 
            onClick={()=>handleClick('TagsBtn')}>
                Tags
            </button>
        </div>
    )
}

export {Header, Menu};