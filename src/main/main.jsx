import React from 'react';
import './main.css';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { loadLocalStorage } from "../functions.js";
//============================

export default function Main() {
    const [outputTimeRequest, set_outputTimeRequest] = useState("");
    const [outputMedianNumbers, set_outputMedianNumbers] = useState("");
    const [outputMaxValue, set_outputMaxValue] = useState("");
    const [outputArrayOfNumbers, set_outputArrayOfNumbers] = useState("");
    const [outputTable, set_outputTable] = useState(null);
    const [needScroll, set_needScroll] = useState(false);
    const my_dispatch = useDispatch();
    const ref_tableContenner = useRef();
    // react-hook-form
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        mode: "All",
    })

    // единоразовый при загрузке
    useEffect(() => {
        my_dispatch({ type: "SET_new_mainData_BD", new_mainData_BD: loadLocalStorage() });

        //----------------------------------
        // загружаем БД при первой загрузке
        let mURL = "http://localhost:5075/getDB";
        my_dispatch({ type: "SET_isActive_dialog_Window_TRUE" });
        fetch(mURL, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
            
        })        
            .then(res => res.json())
            .then((res) => {
                // console.log("Возвращен ответ сервера: ");
                // console.log(res);
                output_DataTable(res);
                my_dispatch({ type: "SET_isActive_dialog_Window_FALSE" });
            })

        //----------------------------------
    }, []
    )

    // при изменении данных
    useEffect(() => {
        // auto listing list form down
        if (needScroll === true) {
            ref_tableContenner.current.scrollTop = ref_tableContenner.current.scrollHeight;
            set_needScroll(false);
        }
    }, [needScroll]
    )


    return (
        <main >
            <div className='visibleNameForm'> MEDIAN NUMBERS TEST</div>

            <form className='mFormContenner' id='mFormContenner'
                action="onSubmit"
                onSubmit={handleSubmit(m_onSubmit_01)}
            >
                <div className='contennerForInputFields'>

                    <div className='inputComplect'>
                        <div className='labelBeforeInputField'>
                            {"Max number:"}
                        </div>

                        <label className='contennerParaSubinput'>
                            <input className='inputField'
                                type="number"
                                //defaultValue={10}
                                {...register('form_amountOf_Numbers', {
                                    required: true,
                                    min: 10,
                                    max: 9999999
                                }
                                )}
                            />

                            {/* блок вывода ошибок   */}
                            <div className='alertNoteUfterField'>
                                {errors.form_amountOf_Numbers?.type === "required" && "* The field is required"}
                                {errors.form_amountOf_Numbers?.type === "min" && "* must be 10 or more"}
                                {errors.form_amountOf_Numbers?.type === "max" && "* no more than 9 999 999, otherwise the server may freeze"}

                            </div>
                        </label>
                    </div>

                    <div className='contennerForBtn'>
                        <button type="submit" >
                            Send
                        </button>
                    </div>
                </div>
            </form>

            <div className='visibleNameForm'> SERVER RESPONSE: </div>
            <div className='formAnsverFromServer'>
                <div>
                    <span> LAST REQUEST TIME:</span>
                    <output readOnly={true} >
                        {String(outputTimeRequest)}
                    </output>
                </div>

                <div>
                    <span> Max number:</span>
                    <output readOnly={true} >
                        {String(outputMaxValue)}
                    </output>
                </div>

                <div>
                    <div>Array of prime numbers in the given range:</div>
                    <textarea
                        disabled={true}
                        value={String(outputArrayOfNumbers)}
                    />
                </div>

                <div>
                    <span>Median numbers:</span>
                    <output readOnly={true} >
                        {String(outputMedianNumbers)}
                    </output>
                </div>
            </div>

            <span style={{ marginTop: "20px" }}> Previous requests: </span>

            <div className='contennerForBtn'>
                <button
                    onClickCapture={() => {
                        deleteAllItemsMongo();
                        output_DataTable();
                    }} >
                    Clear all
                </button>
            </div>

            <div className='mainBottom' ref={ref_tableContenner}>
                <div className='tableContenner'>
                    <table>
                        <thead>
                            <tr className='headTable'>

                                <th style={{ width: "40px" }}  >
                                </th>

                                <th style={{ width: "200px" }}>
                                    Time of requests
                                </th>

                                <th style={{ width: "200px" }}>
                                    Max number
                                </th>

                                <th style={{ width: "200px" }}>
                                    Median numbers
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            {outputTable}
                        </tbody>
                    </table>
                </div>
            </div>

            {/*   defoult is hide   */}
            < DialogWindow />
        </main >
    )

    //--------------------------

    function output_DataTable(data) {
        if (!data) {
            set_outputTable(null);
            set_outputTimeRequest("");
            set_outputArrayOfNumbers("");
            set_outputMaxValue("");
            set_outputMedianNumbers("");
            return;
        }

        let outputCliensTable = data.map(
            (item, i) => (
                <tr key={Math.random()} >
                    <td> {
                        <button
                            className='delBtn'
                            onClickCapture={() => {
                                delOneItem(item._id);
                            }}
                        >
                            {'\u2718'}
                        </button>
                    } </td>

                    <td> {item.mMongo_timeOfReq} </td>
                    <td> {item.mMongo_maxValue} </td>
                    <td> {String(item.mMongo_arrayOfMedians)} </td>
                </tr>
            )
        )
        set_outputTable(outputCliensTable);
    }

    //--------------------------

    function delOneItem(id) {
        let mURL = "http://localhost:5075/dellOne";
        my_dispatch({ type: "SET_isActive_dialog_Window_TRUE" });
        fetch(mURL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dell_ItemID: String(id),
            })
        })
            .then(res => res.json())
            .then((res) => {
                // console.log("Возвращен ответ сервера: ");
                // console.log(res);
                output_DataTable(res);
                my_dispatch({ type: "SET_isActive_dialog_Window_FALSE" });
            })
    }

    //--------------------------

    // данные в переменную "data" попадают из отправленной формы
    function m_onSubmit_01(data) {
        reset(); // сбросили значение в поле ввода на форме
        // =====================================
        let mURL = "http://localhost:5075/add";
        my_dispatch({ type: "SET_isActive_dialog_Window_TRUE" });
        fetch(mURL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataFromClient: Number(data.form_amountOf_Numbers),
            })
        })
            .then(res => res.json())
            .then((res) => {
                // console.log("Возвращен ответ сервера: ");
                // console.log(res);
                output_DataTable(res);
                set_outputTimeRequest(res[res.length - 1].mMongo_timeOfReq);
                set_outputArrayOfNumbers(res[res.length - 1].mMongo_arrayOfNumbers);
                set_outputMaxValue(res[res.length - 1].mMongo_maxValue);
                set_outputMedianNumbers(res[res.length - 1].mMongo_arrayOfMedians);
                my_dispatch({ type: "SET_isActive_dialog_Window_FALSE" });
                // listing list form down
                set_needScroll(true);
            })
    }

    //--------------------------

    function deleteAllItemsMongo() {
        let mURL = "http://localhost:5075/dellAll";
        my_dispatch({ type: "SET_isActive_dialog_Window_TRUE" });
        fetch(mURL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // no need the data
            })
        })
            .then(res => res.json())
            .then((res) => {
                // console.log("Возвращен ответ сервера: ");
                // console.log(res);
                my_dispatch({ type: "SET_isActive_dialog_Window_FALSE" });
            })
    }
}

//=============================================

function DialogWindow() {
    const isActive_dialog_Window = (useSelector(mState => mState.m_reduser_ActiveDialogAddItem.isActive_dialog_Window));

    return (
        <div className={(isActive_dialog_Window === true) ? "universalDialogForm" : "mDisplayNone"} >
            <div className='sub_DialogForm' >
            Waiting for the server ...
            </div>
        </div>
    )
}

