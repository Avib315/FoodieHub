import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import data from './dev.json' // adjust the path as needed

export default function DevPage() {
  return (
    <div className="dev-page">
      <table className="dev-table">
        <thead>
          <tr>
            <th>Page Name</th>
            <th>Is Logic Finish</th>
            <th>Is HTML Finish</th>
            <th>Is Service Integration Finish</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {data.map((page, index) => (
            <tr key={index}>
              <td><Link to={page.path} className="dev-link">{page.name}</Link></td>
              <td>{page.logic ? '✅' : '❌'}</td>
              <td>{page.html ? '✅' : '❌'}</td>
              <td>{page.service ? '✅' : '❌'}</td>
              <td>{page.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
