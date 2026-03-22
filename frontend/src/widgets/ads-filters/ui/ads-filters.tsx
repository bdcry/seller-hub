import type { ReactElement } from 'react';
import { Accordion, Button, Card, Form } from 'react-bootstrap';
import { getCategoryLabel } from '../../../entities/ad/lib/get-category-label';
import styles from './ads-filters.module.css';

export const AdsFilters = (): ReactElement => {
  return (
    <Card className={styles.card}>
      <Card.Header className={styles.header}>Фильтры</Card.Header>
      <Card.Body className={styles.filters}>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0" style={{ border: 'none' }}>
            <Accordion.Header>Категории</Accordion.Header>
            <Accordion.Body style={{ padding: 0, paddingTop: 10 }}>
              <Form className={styles.form}>
                <Form.Check type="checkbox" label={getCategoryLabel('auto')}></Form.Check>
                <Form.Check type="checkbox" label={getCategoryLabel('electronics')}></Form.Check>
                <Form.Check type="checkbox" label={getCategoryLabel('real_estate')}></Form.Check>
                <Form.Check
                  className={styles.switch}
                  type="switch"
                  label="Только требующие доработок"
                />
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Button variant="secondary">Сбросить фильтры</Button>
      </Card.Body>
    </Card>
  );
};
