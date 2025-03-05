import { Col, Container, Row } from 'react-bootstrap';
import PageBadge from '../component/PageBadge/PageBadge';
import IncomeByDate from '../component/IncomeByDate';
import IncomeByMonth from '../component/IncomeByMonth';
import MostSellingProduct from '../component/MostSellingProduct';
import ExpireDateSoonProduct from '../component/ExpireDateSoonProduct';
import TotalInventoryGraph from '../component/TotalInventoryGraph';
import ProductlifeCycle from '../component/ProductlifeCycle';
import FrequentlyCustomers from '../component/FrequentlyCustomers';
import StaffPerformance from '../component/StaffPerformance';

const HomePage = () => {
  
  return (
    <>
      <PageBadge title='Smart Dashboard'/>
      <Container>
        <Row className='h-50'>
          <Col><IncomeByDate/></Col>
          <Col><IncomeByMonth/></Col>
        </Row>
        <Row className='h-50 w-100'>
          <Col><TotalInventoryGraph/></Col>
        </Row>
        <Row className='h-50 w-100'>
        <ProductlifeCycle/>
        </Row>
      </Container>
      <MostSellingProduct/>
      <StaffPerformance/>
      <FrequentlyCustomers/>
      <ExpireDateSoonProduct/>
    </>
  )
}
export default HomePage;