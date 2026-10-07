import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
function Notifications() {
  const { t } = useTranslation()
  return (
    <Container>
      <span>
       {t("common.noNewNotifications")}
      </span>
      </Container>
  )
}

export default Notifications
const Container = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  height:50vh;
`