import { createContext, useState,useEffect } from "react";
import run from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => 
{

    const [input,setInput] = useState("");
    const [recentPrompt,setrecentPrompt] = useState("");
    const [previousPrompt,setPreviousPrompts] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");
    const [theme,setTheme] = useState("light");


    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        // Store the theme in local storage
    };

    useEffect(() => {
        document.body.className = theme; // Apply the theme to the body element
    }, [theme]);

    const delayPara = (index,nextWord) => 
    {
        setTimeout(function()
        {   
            setResultData(prev=>prev+nextWord);
        },100*index);
    }

    const newChat = () =>
    {
        setLoading(false);
        setShowResult(false);


    }

    const onSent = async (prompt) => {

        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt !== undefined)
        {
            response = await run(prompt);
            setrecentPrompt(prompt);
        }

        else
        {
            setPreviousPrompts(prev=>[...prev,input]);
            setrecentPrompt(input);
            response = await run(input);
        }
       
        let responseArray = response.split("**");
        let newResponse = "";

        for(let i=0;i<responseArray.length;i++)
        {
            if(i === 0 || i%2 !== 1)
            {
                newResponse+=responseArray[i];

            }
            else
            {
                newResponse+= "<b>" +responseArray[i] + "</b>"
            }
        }

        let newResponse2 = newResponse.split("*").join("<br/>");

        let newResponseArray = newResponse2.split(" ");
        for(let i=0;i<newResponseArray.length;i++)
        {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ");
        }
        setLoading(false);
        setInput("");
    }

    // onSent("what is react js");
    
    const contextValue = {

        previousPrompt,
        setPreviousPrompts,
        recentPrompt,
        onSent,
        setrecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        theme,
        toggleTheme

    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider