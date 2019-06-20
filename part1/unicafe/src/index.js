import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Header = ({ title }) => {
    return (
        <div>
            <h1>
                {title}
            </h1>
        </div>
    )
}

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>{text}</button>
)

const Statistic = ({ text, value }) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

const Statistics = ({ title, good, neutral, bad }) => {
    const total = good + neutral + bad
    if (total === 0) {
        return (
            <div>
                <p>No feedback given</p>
            </div>
        )
    }
    return (
        <div>
            <h1>{title}</h1>
            <table>
                <tbody>
                    <Statistic text='good' value={good} />
                    <Statistic text='neutral' value={neutral} />
                    <Statistic text='bad' value={bad} />
                    <Statistic text='all' value={total} />
                    <Statistic text='average' value={(good - bad) / total} />
                    <Statistic text='positive' value={good / total * 100 + '%'} />
                </tbody>
            </table>
        </div>
    )
}

const App = (props) => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <Header title='give feedback' />
            <Button handleClick={() => setGood(good + 1)} text='good' />
            <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
            <Button handleClick={() => setBad(bad + 1)} text='bad' />
            <Statistics title='statistics' good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));


