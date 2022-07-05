/// <reference types="cypress" />
import demoInstance from '../../fixtures/demoInstance.json'

describe('chatterbox-staging.element.io test', () => {
  beforeEach(() => {
    cy.fixture('demoInstance').then(({url}) => {
      cy.visit(url)
    });
  });

  it('displays the chatterbox icon', () => {
    cy.get('.start').should('have.length', 1);
  });

  it('opens the chatterbox privacy window', () => {
    cy.get('.start > button').click();
    cy.frameLoaded('.chatterbox-iframe');
    cy.enter('.chatterbox-iframe').then(frame => {
      frame().find('.PolicyAgreementView_next').should('have.length', 1);
      frame().find('.PolicyAgreementView_cancel').should('have.length', 1);
    })
  });

  it('open the main chat window and sends a message', () => {
    cy.get('.start > button').click();
    cy.frameLoaded('.chatterbox-iframe');
    cy.enter('.chatterbox-iframe').then(frame => {
      frame().find('.PolicyAgreementView_next').click();
      cy.fixture('demoInstance').then(({headerName}) => {
        frame().find('.RoomHeaderView_name').should('have.text', headerName);
      });
      frame().find('.MessageComposer').should('have.length', 1);
      // Operator can take a long time to join
      frame().find('.Timeline .AnnouncementView', { timeout: 120000 }).should('have.text', 'operator joined the room');
      frame().find('.MessageComposer textarea').type('Hello world!{enter}');
      frame().find('.Timeline .Timeline_messageBody').should('contain.text', 'Hello world!');
      frame().find('.Timeline .Timeline_messageSender').should('text', 'me');
    })
  });
})
