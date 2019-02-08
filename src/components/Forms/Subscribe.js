import React from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {css} from '@emotion/core'
import {rhythm} from '../../lib/typography'
import {bpMaxSM} from '../../lib/breakpoints'
import Message from '../ConfirmMessage/Message'
import {PleaseConfirmIllustration} from '../ConfirmMessage/Illustrations'

const SubscribeSchema = Yup.object().shape({
  email_address: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  first_name: Yup.string(),
})

function PostSubmissionMessage() {
  return (
    <div
      css={css`
        h2 {
          color: white !important;
        }
      `}
    >
      <Message
        illustration={PleaseConfirmIllustration}
        title="Great, one last thing..."
        body="I just sent you an email with the confirmation link. 
          **Please check your inbox!**"
      />
    </div>
  )
}

function Subscribe(props) {
  const [submitted, setSubmitted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [response, setResponse] = React.useState(null)
  const [errorMessage, setErrorMessage] = React.useState(null)

  async function handleSubmit(values) {
    setSubmitted(false)
    setLoading(true)
    try {
      const responseJson = await fetch(
        `https://app.convertkit.com/forms/827139/subscriptions`,
        {
          method: 'post',
          body: JSON.stringify(values, null, 2),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      ).then(r => r.json())
      setSubmitted(true)
      setResponse(responseJson)
      setErrorMessage(null)
    } catch (error) {
      setSubmitted(false)
      setErrorMessage('Something went wrong!')
    }
    setLoading(false)
  }

  const successful = response && response.status === 'success'

  return (
    <div
      {...props}
      css={css`
        color: white;
        max-width: 350px;
        padding: 40px;
        background: #231c42;
        background-image: linear-gradient(-213deg, #5e31dc 0%, #3155dc 100%),
          linear-gradient(
            32deg,
            rgba(255, 255, 255, 0.25) 33%,
            rgba(0, 0, 0, 0.25) 100%
          );
        border-radius: 5px;
      `}
    >
      {!successful && (
        <h3
          css={css`
            margin-bottom: ${rhythm(1)};
            margin-top: 0;
            color: white;
          `}
        >
          Join the Newsletter
        </h3>
      )}

      {!successful && (
        <Formik
          initialValues={{
            email_address: '',
            first_name: '',
          }}
          validationSchema={SubscribeSchema}
          onSubmit={values => handleSubmit(values)}
          render={() => (
            <Form
              css={css`
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                label {
                  margin: 10px 0;
                }
                .field-error {
                  display: block;
                  //position: absolute;
                  color: rgba(255, 255, 255, 0.75);
                  font-size: 80%;
                }
                input,
                label {
                  width: 100%;
                  font-size: 16px;
                }
                ${bpMaxSM} {
                  flex-direction: column;
                  align-items: flex-start;
                  width: auto;
                  label,
                  input {
                    margin: 5px 0 0 0 !important;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                  }
                }
                button {
                  margin-top: 20px;
                  font-size: 16px;
                }
              `}
            >
              <label htmlFor="first_name">
                <div
                  css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                  `}
                >
                  First Name
                  <ErrorMessage
                    name="first_name"
                    component="span"
                    className="field-error"
                  />
                </div>
                <Field
                  aria-label="your first name"
                  aria-required="false"
                  name="first_name"
                  placeholder="Jane"
                  type="text"
                />
              </label>
              <label htmlFor="email">
                <div
                  css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                  `}
                >
                  Email
                  <ErrorMessage
                    name="email_address"
                    component="span"
                    className="field-error"
                  />
                </div>
                <Field
                  aria-label="your email address"
                  aria-required="true"
                  name="email_address"
                  placeholder="jane@acme.com"
                  type="email"
                />
              </label>
              <button data-element="submit" type="submit">
                {!loading && 'Subscribe'}
                {loading && 'Submitting...'}
              </button>
            </Form>
          )}
        />
      )}
      {submitted && !loading && <PostSubmissionMessage response={response} />}
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  )
}

export default Subscribe
