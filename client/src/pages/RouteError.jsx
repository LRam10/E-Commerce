import React from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import NotFound from './NotFound'

export default function RouteError() {
  const error = useRouteError()

  //The default router screen is a developer message, keep the detail in the console instead
  if (import.meta.env.DEV) {
    console.error('Route error:', error)
  }

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />
  }

  return (
    <NotFound
      code="Something went wrong"
      title="This page ran into a problem"
      message="Sorry about that. Try again in a moment, or head back to the shop."
    />
  )
}
