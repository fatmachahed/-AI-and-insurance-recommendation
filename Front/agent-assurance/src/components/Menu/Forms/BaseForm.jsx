"use client"

import React from "react"


class BaseForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: this.getInitialData(),
      errors: {},
    }
  }


  getInitialData() {
    return {}
  }

  
  getFormFields() {
    return []
  }

  handleInputChange = (field, value) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
    }))
  }

  validateForm = () => {
    const errors = {}
    const fields = this.getFormFields()

    fields.forEach((field) => {
      if (field.required && !this.state.formData[field.name]) {
        errors[field.name] = `${field.label} est requis`
      }
    })

    this.setState({ errors })
    return Object.keys(errors).length === 0
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.validateForm()) {
      this.props.onSubmit && this.props.onSubmit(this.state.formData)
    }
  }

  renderField(field) {
    const { formData, errors } = this.state

    return (
      <div key={field.name} className="form-field">
        <label className="form-label">{field.label}:</label>
        <div className="form-display-value">{formData[field.name] || ""}</div>
      </div>
    )
  }

  render() {
    const fields = this.getFormFields()

    return (
      <div className="base-form">
        <h3 className="form-title">{this.props.title}</h3>
        <div className="form-grid">{fields.map((field) => this.renderField(field))}</div>
      </div>
    )
  }
}

export default BaseForm
