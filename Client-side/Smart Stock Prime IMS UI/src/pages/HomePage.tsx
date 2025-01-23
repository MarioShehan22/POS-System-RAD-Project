import '../component/EmblaCarousel/embla.css'
import  "../component/EmblaCarousel/embla.css";
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
      <h3 className='text-center mt-2'>Most Selling Product</h3>
      <MostSellingProduct/>
      <h3 className='text-center'>Expire Date Soon Product</h3>
      <ExpireDateSoonProduct/>
    </>
  )
}
export default HomePage;