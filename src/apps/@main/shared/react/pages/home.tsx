import logo from '@/resources/img/react.svg'
import crudActionCreators from '@/shared/redux/actions/crud-action-creators'
import { gql } from 'apollo-boost'
import React, { useMemo, useState } from 'react'
import { Query } from 'react-apollo'
import { useDispatch } from 'react-redux'
import { useMount } from '../hooks/useMount'
import './home.css'
const { load } = crudActionCreators('moduleA', 'cat')
import { IAction, IState } from '@/shared/redux/redux-types'

const MY_QUERY = gql`
{
    getStudent (fullName: "aw-2") {
        fullName
        type
        uuid
        aspirations {
            uuid
            skill {
                uuid
                name
                description
                type
            }
        }
    }
}`

const Home = () => {

    const dispatch = useDispatch()
    const [name, setName] = useState('huzaifa')
    const date = Date()
    useMount(() => {
        console.log('HomeUseEffect' + date)
        dispatch(load(undefined, true))
    })

    const handleName = () => setName(name + 'a')
    return (
        <div className='Home'>
            <div className='Home-header'>
                <img src={logo} className='Home-logo' alt='logo' />
                <h2 className='text-blue'>Welcome to Razzle</h2>
            </div>
            <p className='Home-intro'>
                To get started, edit <code>src/App.js</code> or{' '}
                <code>src/Home.js</code> and save to reload.
            </p>
            <Query query={MY_QUERY}>
                {({ loading, error, data, refetch }) => {
                    if (loading) { return <p>Loading...</p> }
                    if (error) { return <p>Error :</p> }
                    return (
                        <div>
                            {data.getStudent[0].aspirations.map(({ skill: { name: skillName, type } }) => (
                                <div key={skillName}>
                                    <p>{skillName}: {type}</p>
                                </div>
                            ))}
                            <input value={'Refetch!'} type='button' onClick={() => refetch()} />
                        </div>
                    )

                }}
            </Query>
            <ul className='Home-resources'>
                <li>
                    <a href='https://github.com/jaredpalmer/razzle'>Docs</a>
                </li>
                <li>
                    <a href='https://github.com/jaredpalmer/razzle/issues'>Issues</a>
                </li>
                <li>
                    <a href='https://palmer.chat'>Community Slack</a>
                </li>
            </ul>
            <input value={name} type='button' onClick={handleName} />
        </div>
    )
}

export default Home
