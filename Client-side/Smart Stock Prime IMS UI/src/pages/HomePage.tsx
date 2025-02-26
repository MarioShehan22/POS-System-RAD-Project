import { Col, Container, Row } from 'react-bootstrap';
import PageBadge from '../component/PageBadge/PageBadge';
import IncomeByDate from '../component/IncomeByDate';
import IncomeByMonth from '../component/IncomeByMonth';
import MostSellingProduct from '../component/MostSellingProduct';
import ExpireDateSoonProduct from '../component/ExpireDateSoonProduct';

const HomePage = () => {
  
  return (
    <>
      <PageBadge title='Smart Dashboard'/>
      <Container>
        <Row className='h-50'>
          <Col><IncomeByDate/></Col>
          <Col><IncomeByMonth/></Col>
        </Row>
      </Container>
      <MostSellingProduct/>
      <ExpireDateSoonProduct/>
    </>
  )
}
export default HomePage;